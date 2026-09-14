import { Injectable } from '@nestjs/common';
import { db } from './connection.js';

@Injectable()
export class DatabaseService {
  public readonly db = db;
}