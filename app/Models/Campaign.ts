import { DateTime } from "luxon";
import { BaseModel, column, HasMany, hasMany } from "@ioc:Adonis/Lucid/Orm";
import Donation from "./Donation";

export default class Campaign extends BaseModel {
  @column({ isPrimary: true })
  public id: number;

  @column({})
  public user_id: number;

  @column({})
  public title: string;

  @column({})
  public content: string;

  @column({})
  public target: number;

  @column({})
  public target_date: string;

  @hasMany(() => Donation, {
    foreignKey: "campaign_id",
  })
  public donations: HasMany<typeof Donation>;

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime;

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime;
}
