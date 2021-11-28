import {
  HttpException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AuthDto } from './dto';
import { AuthDocument } from './interfaces/auth.interface';

import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { from, map, Observable, of } from 'rxjs';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel('Auth')
    private readonly authModel: Model<AuthDocument>,
    private readonly jwtService: JwtService,
  ) {}

  generateJWT(user: AuthDocument): Observable<string> {
    return from(this.jwtService.signAsync({ user }));
  }

  private async hashPassword(password: string): Promise<string> {
    return await bcrypt.hash(password, 12);
  }

  comparePasswords(
    newPassword: string,
    passwordHash: string,
  ): Observable<any | boolean> {
    return of<any | boolean>(bcrypt.compare(newPassword, passwordHash));
  }

  async signinLocal(dto: AuthDto) {
    const user = await this.authModel.findOne({ email: dto.email }).exec();
    if (!user) throw new UnauthorizedException('Credentials incorrect');
    //const isMatch = await bcrypt.compare(dto.password, user.password);
    if (!this.comparePasswords(dto.password, user.password))
      throw new UnauthorizedException('Credentials incorrect');

    return user;
  }

  async signupLocal(dto: AuthDto) {
    const user = await this.authModel.findOne({ email: dto.email }).exec();
    if (user) throw new UnauthorizedException('Registered email');

    const hash = await this.hashPassword(dto.password);
    const newAuth = new this.authModel({
      email: dto.email,
      password: hash,
      signedDate: Date.now(),
    });
    const result = await newAuth.save();
    return result._id;
  }

  public getUsers(): Promise<AuthDocument[]> {
    const users = this.authModel.find().exec();
    if (!users) {
      throw new HttpException('Not found', 404);
    }
    return users;
  }
}
