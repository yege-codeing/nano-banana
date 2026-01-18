-- Create user_credits table
CREATE TABLE user_credits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  total_credits INTEGER NOT NULL DEFAULT 0,
  free_credits INTEGER NOT NULL DEFAULT 10,
  subscription_credits INTEGER NOT NULL DEFAULT 0,
  subscription_expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id)
);

CREATE INDEX idx_user_credits_user_id ON user_credits(user_id);
CREATE INDEX idx_user_credits_expires ON user_credits(subscription_expires_at);

-- Create credit_transactions table
CREATE TABLE credit_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  amount INTEGER NOT NULL,
  transaction_type VARCHAR(50) NOT NULL,
  description TEXT,
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_credit_transactions_user_id ON credit_transactions(user_id);
CREATE INDEX idx_credit_transactions_created ON credit_transactions(created_at);

-- Create subscriptions table
CREATE TABLE subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  paypal_order_id VARCHAR(255) NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  status VARCHAR(50) NOT NULL,
  credits_granted INTEGER NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX idx_subscriptions_paypal_order ON subscriptions(paypal_order_id);
CREATE INDEX idx_subscriptions_expires ON subscriptions(expires_at);

-- Enable Row Level Security
ALTER TABLE user_credits ENABLE ROW LEVEL SECURITY;
ALTER TABLE credit_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view own credits" ON user_credits
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can view own transactions" ON credit_transactions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can view own subscriptions" ON subscriptions
  FOR SELECT USING (auth.uid() = user_id);

-- Create function for atomic credit consumption
CREATE OR REPLACE FUNCTION consume_user_credits(
  p_user_id UUID,
  p_amount INTEGER
)
RETURNS TABLE(success BOOLEAN, remaining_credits INTEGER, error_message TEXT)
LANGUAGE plpgsql
AS $$
DECLARE
  v_total_credits INTEGER;
  v_subscription_credits INTEGER;
  v_free_credits INTEGER;
  v_new_subscription_credits INTEGER;
  v_new_free_credits INTEGER;
  v_remaining INTEGER;
BEGIN
  SELECT total_credits, subscription_credits, free_credits
  INTO v_total_credits, v_subscription_credits, v_free_credits
  FROM user_credits
  WHERE user_id = p_user_id
  FOR UPDATE;

  IF NOT FOUND THEN
    RETURN QUERY SELECT FALSE, 0, 'user_not_found'::TEXT;
    RETURN;
  END IF;

  IF v_total_credits < p_amount THEN
    RETURN QUERY SELECT FALSE, v_total_credits, 'insufficient_credits'::TEXT;
    RETURN;
  END IF;

  v_remaining := p_amount;
  v_new_subscription_credits := v_subscription_credits;
  v_new_free_credits := v_free_credits;

  IF v_new_subscription_credits >= v_remaining THEN
    v_new_subscription_credits := v_new_subscription_credits - v_remaining;
    v_remaining := 0;
  ELSE
    v_remaining := v_remaining - v_new_subscription_credits;
    v_new_subscription_credits := 0;
    v_new_free_credits := v_new_free_credits - v_remaining;
  END IF;

  UPDATE user_credits
  SET
    total_credits = v_total_credits - p_amount,
    subscription_credits = v_new_subscription_credits,
    free_credits = v_new_free_credits,
    updated_at = NOW()
  WHERE user_id = p_user_id;

  INSERT INTO credit_transactions (user_id, amount, transaction_type, description)
  VALUES (p_user_id, -p_amount, 'consume', '图片生成');

  RETURN QUERY SELECT TRUE, (v_total_credits - p_amount), NULL::TEXT;
END;
$$;
