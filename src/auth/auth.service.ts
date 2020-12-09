import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

import { UsersService } from '../users/users.service';
import { User } from '../users/user.entity';
import CredentialsDto from './dto/credentials.dto';
import tokenPayload from './interfaces/tokenPayload.interface';
import { AuthResponse } from './interfaces/authResponse.interface';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  public async validateUser(email: string, new_password: string) {
    try {
      const user = await this.usersService.getByEmail(email);
      await this.verifyPassword(new_password, user.password);
      const { password, ...result } = user;
      return result;
    } catch (error) {
      throw new HttpException(
        'Wrong credentials provided',
        HttpStatus.UNAUTHORIZED,
      );
    }
  }

  private async verifyPassword(
    plainTextPassword: string,
    hashedPassword: string,
  ) {
    const isPasswordMatching = await bcrypt.compare(
      plainTextPassword,
      hashedPassword,
    );
    if (!isPasswordMatching) {
      throw new HttpException(
        'Wrong credentials provided',
        HttpStatus.UNAUTHORIZED,
      );
    }
  }

  login(user: User): AuthResponse {
    const accessToken = this.getAccessToken({
      id: user.id,
      email: user.email,
    });
    return { accessToken };
  }

  private getAccessToken(payload: tokenPayload): string {
    return this.jwtService.sign(payload);
  }

  async register(userData: CredentialsDto) {
    const checkUserExist = await this.usersService.checkByEmail(userData.email);
    if (checkUserExist) {
      throw new HttpException(
        'User with that username already exists',
        HttpStatus.BAD_REQUEST,
      );
    }
    try {
      return await this.usersService.create(userData);
    } catch (error) {
      throw new HttpException(
        'Something went wrong',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
