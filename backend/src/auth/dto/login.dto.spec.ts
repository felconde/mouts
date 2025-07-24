import { validate } from 'class-validator';
import { LoginDto } from './login.dto';

describe('LoginDto', () => {
  it('should be defined', () => {
    expect(new LoginDto()).toBeDefined();
  });

  describe('validation', () => {
    it('should pass validation with valid data', async () => {
      const loginDto = new LoginDto();
      loginDto.email = 'test@example.com';
      loginDto.password = 'password123';

      const errors = await validate(loginDto);
      expect(errors).toHaveLength(0);
    });

    it('should fail validation with invalid email', async () => {
      const loginDto = new LoginDto();
      loginDto.email = 'invalid-email';
      loginDto.password = 'password123';

      const errors = await validate(loginDto);
      expect(errors).toHaveLength(1);
      expect(errors[0].constraints?.isEmail).toBeDefined();
    });

    it('should fail validation with empty email', async () => {
      const loginDto = new LoginDto();
      loginDto.email = '';
      loginDto.password = 'password123';

      const errors = await validate(loginDto);
      expect(errors).toHaveLength(1);
      expect(errors[0].constraints?.isNotEmpty).toBeDefined();
    });

    it('should fail validation with short password', async () => {
      const loginDto = new LoginDto();
      loginDto.email = 'test@example.com';
      loginDto.password = '123';

      const errors = await validate(loginDto);
      expect(errors).toHaveLength(1);
      expect(errors[0].constraints?.minLength).toBeDefined();
    });

    it('should fail validation with empty password', async () => {
      const loginDto = new LoginDto();
      loginDto.email = 'test@example.com';
      loginDto.password = '';

      const errors = await validate(loginDto);
      expect(errors).toHaveLength(1);
      expect(errors[0].constraints?.isNotEmpty).toBeDefined();
    });
  });
}); 