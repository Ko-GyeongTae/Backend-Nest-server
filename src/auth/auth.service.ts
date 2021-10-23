import { BadRequestException, ForbiddenException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { hash, compare } from 'bcrypt';
import { User } from 'src/entity/user.entity';
import { Repository } from 'typeorm';
import { LoginDto } from './dto/login.dto';
import { SignupDto } from './dto/signup.dto';
import { VerifyDto } from './dto/verify.dto';

@Injectable()
export class AuthService {
    private logger = new Logger();

    constructor(
        @InjectRepository(User) private userRepository: Repository<User>,
        private readonly jwtService: JwtService,
    ) { }

    async signup(body: SignupDto) {
        const { id, password } = body;
        if (id.indexOf(' ') !== -1 || password.indexOf(' ') !== -1) {
            throw new BadRequestException();
        }
        const hashedpassword = await hash(password, 10);
        await this.userRepository.save({
            id: id,
            password: hashedpassword
        })
        this.logger.log('[SUCCESS] Admin Signup');
        return {
            message: '회원가입에 성공했습니다.'
        }
    }

    async login(body: LoginDto) {
        const admin = await this.userRepository.findOne({ id: body.id });
        if (body.id !== admin.id) {
            throw new NotFoundException();
        }
        await this.verifyPassword(body.password, admin.password);
        const jwt = await this.jwtService.signAsync({
            id: admin.id
        });
        this.logger.log('[SUCCESS] Admin Login');
        return {
            message: '로그인에 성공했습니다.',
            accessToken: jwt
        }
    }

    async verify(body: VerifyDto) {
        return {
            email: body.email
        }
    }

    async refresh(req: Request) {
        return { 
            req: req.headers
        }
    }

    //패스워드 동일여부.
    private async verifyPassword(plainPassword: string, hashedpassword: string): Promise<any> {
        const isPasswordMatch = await compare(plainPassword, hashedpassword);
        if (!isPasswordMatch) {
            throw new ForbiddenException();
        }
    }
}
