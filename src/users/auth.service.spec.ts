import { Test } from '@nestjs/testing';

import { AuthService } from './auth.service';
import { UsersService } from './users.service';
import { User } from './user.entity';

describe('AuthService', () => {
  let service: AuthService;
  let fakeUsersService: Partial<UsersService>;

  beforeEach(async () => {
    const users: User[] = [];

    fakeUsersService = {
      find: (email: string) => {
        const filteredUsers = users.filter((user) => user.email === email);

        return Promise.resolve(filteredUsers);
      },
      create: (email: string, password: string) => {
        const user = {
          id: Math.floor(Math.random() * 9_999_999),
          email,
          password,
        } as User;

        users.push(user);

        return Promise.resolve(user);
      },
    };

    const module = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: fakeUsersService,
        },
      ],
    }).compile();

    service = module.get(AuthService);
  });

  it('can create as instance of auth service', () => {
    expect(service).toBeDefined();
  });

  it('create a new user with a salted and hashed password', async () => {
    const user = await service.signup('asdsd@asda.com', 'asdads');

    expect(user).not.toEqual('asdads');

    const [salt, hash] = user.password.split('.');

    expect(salt).toBeDefined();

    expect(hash).toBeDefined();
  });

  it.failing(
    'throws an error if user signs up with email that is in use',
    (done) => {
      service.signup('asdsd@asda.com', 'asdads').catch(done);
    },
  );

  it.failing('throw if signin is called with an unused email', (done) => {
    service.signin('asdasd@asd.com', 'asdad').catch(done);
  });

  it.failing('throw if an invalid password is provided', (done) => {
    fakeUsersService.find = () =>
      Promise.resolve([
        {
          email: 'asdad@asd.com',
          password: 'asdads',
        } as User,
      ]);

    service.signin('asdad@asd.com', 'passwod').catch(done);
  });

  it('returns a user if correct password is provided', async () => {
    await service.signup('asdads@.com', 'myPassword');

    const user = await service.signin('asdads@.com', 'myPassword');

    expect(user).toBeDefined();

    // const user = await service.signup('asdad@asd.com', 'myPassword');

    // console.log('user', user);
  });
});
