import { ObjectType, Field, Int } from 'type-graphql';

@ObjectType()
export class Token
{
    @Field(() => String, { nullable: true })
    accessToken!: string;

    @Field(() => String, { nullable: true })
    refreshToken!: string;

    // always fail by default
    @Field(() => String)
    message: string = 'Invalid credentials';
    // always fail by default
    @Field(() => Int)
    resultCode: number = 1;
}