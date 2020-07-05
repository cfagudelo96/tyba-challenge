import { User } from './user.entity';

jest.mock('bcrypt');

describe('User', () => {
  it('should encrypt the password', async () => {
    const password = 'Test12345';
    const user = new User({ password });
    await user.encryptPassword();
    expect(user.password).not.toBe(password);
  });
});
