import * as bcrypt from 'bcrypt'

const SALTROUNDS = 10

export async function hashPassword(password: string): Promise<string> {
  const saltRounds = SALTROUNDS
  const hash = await bcrypt.hash(password, saltRounds)

  return hash
}

