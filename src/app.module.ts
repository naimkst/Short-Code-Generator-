import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver } from '@nestjs/apollo';
import { join } from 'path';
import { DatabaseModule } from './database/database.module';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ShorterModule } from './shorter/shorter.module';

@Module({
  imports: [
    GraphQLModule.forRoot({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      cors: {
        credentials: true,
        origin: true,
      },
      context: ({ req, res }) => ({ req, res })
    }),
    JwtModule.register({
      secret: 'secret',
      signOptions: { expiresIn: '1d' },
    }),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    UsersModule,
    DatabaseModule,
    ShorterModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
