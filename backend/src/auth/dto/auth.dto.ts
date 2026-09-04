import { IsEmail, IsString, MinLength, MaxLength, Matches, IsOptional, IsEnum } from 'class-validator';
import { UserRole } from '../../users/user.entity';

export class RegisterDto {
  @IsString()
  @MinLength(20)
  @MaxLength(60)
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  @MaxLength(400)
  address: string;

  @IsString()
  @MinLength(8)
  @MaxLength(16)
  @Matches(/^(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>])/, {
    message: 'Password must contain at least one uppercase letter and one special character',
  })
  password: string;

  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole;
}

export class LoginDto {
  @IsEmail()
  email: string;

  @IsString()
  password: string;
}