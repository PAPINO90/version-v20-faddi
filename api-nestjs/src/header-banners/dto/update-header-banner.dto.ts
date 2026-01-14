import { PartialType } from '@nestjs/mapped-types';
import { CreateHeaderBannerDto } from './create-header-banner.dto';

export class UpdateHeaderBannerDto extends PartialType(CreateHeaderBannerDto) {}