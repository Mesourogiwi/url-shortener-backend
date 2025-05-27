import {IsNotEmpty, IsOptional} from 'class-validator'

export class CreateShortenerDto {
    @IsNotEmpty()
    url: string

    @IsOptional()
    name?: string
}
