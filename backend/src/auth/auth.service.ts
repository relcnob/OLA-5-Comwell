import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { Response } from 'express';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async signUp(createUserDto: CreateUserDto) {
    const { password, ...userData } = createUserDto;
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await this.usersService.createUser({
      ...userData,
      password: hashedPassword,
    });
    await newUser.save();

    return {
      email: newUser.email,
      _id: newUser._id,
    };
  }

  async signIn(email: string, pass: string) {
    const user =
      (await this.usersService.findOne(email)) ||
      (() => {
        throw new NotFoundException();
      })();

    const isMatch = await bcrypt.compare(pass, user.password);
    if (!isMatch) {
      throw new UnauthorizedException();
    }
    const payload = {
      sub: user._id,
      email: user.email,
      fullName: user.fullName,
      zipCode: user.zipCode,
      phone: user.phone,
      gender: user.gender,
      birthday: user.dateOfBirth,
      roles: user.roles,
    };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }

  signOut(response: Response) {
    if (response) {
      // response.clearCookie('token').status(200).json({
      //   message: 'You have logged out',
      // });
      response.status(200).json({
        message: 'You have logged out',
      });
    } else {
      response.status(401).json({
        error: 'Invalid jwt',
      });
    }
  }
}
