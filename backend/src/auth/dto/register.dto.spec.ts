import { validate } from 'class-validator';
import { RegisterDto } from './register.dto';

describe('RegisterDto', () => {
  it('should be defined', () => {
    expect(new RegisterDto()).toBeDefined();
  });

  describe('validation', () => {
    it('should pass validation with valid data', async () => {
      const registerDto = new RegisterDto();
      registerDto.name = 'Test User';
      registerDto.email = 'test@example.com';
      registerDto.password = 'password123';
      registerDto.phone = '123456789';

      const errors = await validate(registerDto);
      expect(errors).toHaveLength(0);
    });

    it('should pass validation without optional phone', async () => {
      const registerDto = new RegisterDto();
      registerDto.name = 'Test User';
      registerDto.email = 'test@example.com';
      registerDto.password = 'password123';

      const errors = await validate(registerDto);
      expect(errors).toHaveLength(0);
    });

    it('should fail validation with empty name', async () => {
      const registerDto = new RegisterDto();
      registerDto.name = '';
      registerDto.email = 'test@example.com';
      registerDto.password = 'password123';

      const errors = await validate(registerDto);
      expect(errors).toHaveLength(1);
      expect(errors[0].constraints?.isNotEmpty).toBeDefined();
    });

    it('should fail validation with name too long', async () => {
      const registerDto = new RegisterDto();
      registerDto.name = 'a'.repeat(101); // 101 characters
      registerDto.email = 'test@example.com';
      registerDto.password = 'password123';

      const errors = await validate(registerDto);
      expect(errors).toHaveLength(1);
      expect(errors[0].constraints?.maxLength).toBeDefined();
    });

    it('should fail validation with invalid email', async () => {
      const registerDto = new RegisterDto();
      registerDto.name = 'Test User';
      registerDto.email = 'invalid-email';
      registerDto.password = 'password123';

      const errors = await validate(registerDto);
      expect(errors).toHaveLength(1);
      expect(errors[0].constraints?.isEmail).toBeDefined();
    });

    it('should fail validation with email too long', async () => {
      const registerDto = new RegisterDto();
      registerDto.name = 'Test User';
      registerDto.email = 'a'.repeat(150) + '@example.com'; // 151 characters
      registerDto.password = 'password123';

      const errors = await validate(registerDto);
      expect(errors).toHaveLength(1);
      expect(errors[0].constraints?.maxLength).toBeDefined();
    });

    it('should fail validation with short password', async () => {
      const registerDto = new RegisterDto();
      registerDto.name = 'Test User';
      registerDto.email = 'test@example.com';
      registerDto.password = '123';

      const errors = await validate(registerDto);
      expect(errors).toHaveLength(1);
      expect(errors[0].constraints?.minLength).toBeDefined();
    });

    it('should fail validation with phone too long', async () => {
      const registerDto = new RegisterDto();
      registerDto.name = 'Test User';
      registerDto.email = 'test@example.com';
      registerDto.password = 'password123';
      registerDto.phone = '123456789012345678901'; // 21 characters

      const errors = await validate(registerDto);
      expect(errors).toHaveLength(1);
      expect(errors[0].constraints?.maxLength).toBeDefined();
    });
  });
}); 