import { IsNumber, IsOptional, IsPositive, Min } from "class-validator";


export class PaginationDto {

    @IsOptional()
    @IsPositive()
    @IsNumber()
    @Min(1)
    limite?: number;

    @IsOptional()
    @IsPositive()
    @IsNumber()
    omitir?: number
}