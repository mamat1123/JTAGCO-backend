import { Request } from 'express';
import { User } from '@supabase/supabase-js';

export interface RequestWithUser extends Request {
  user: User;
}
