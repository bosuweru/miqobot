/**
 * @file Initializes the Winston logging utility.
 * @author Dandy! <116328571+bosuweru@users.noreply.github.com>
 * @version 3.0.0
 * @license AGPL-3.0
 *
 * A multipurpose and open-source Discord bot that interacts with XIVAPI.
 * Copyright (C) 2023 Dandy!
 *
 * This program is free software: you can redistribute it and/or modify it under
 * the terms of the GNU Affero General Public License as published by the Free
 * Software Foundation, either version 3 of the License, or (at your option) any
 * later version.
 *
 * This program is distributed in the hope that it will be useful, but WITHOUT
 * ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS
 * FOR A PARTICULAR PURPOSE. See the GNU Affero General Public License for more
 * details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program. If not, see <https://www.gnu.org/licenses/>.
 */
"use strict";

import child_process from "node:child_process";

import * as winston from "winston";
import "winston-daily-rotate-file";

import { Logtail } from "@logtail/node";
import { LogtailTransport } from "@logtail/winston";

const workflow: boolean = process.env.NODE_ENV === "workflow";
const production: boolean = process.env.NODE_ENV === "production";
const development: boolean = process.env.NODE_ENV === "development";

/**
 * Initializes the Winston logging utility.
 * @class
 * @since 3.0.0
 */
class Winston {
  public logger: winston.Logger;

  constructor() {
    this.logger = winston.createLogger({
      level: production ? "info" : "silly",
      format: winston.format.json(),
      levels: winston.config.npm.levels,
      silent: workflow ? true : false,
      transports: [],
      defaultMeta: {
        complex: {
          engines: {
            node: process.versions.node,
            npm: child_process.execSync("npm -v").toString().trim(),
          },
          machine: {
            architecture: process.arch,
            platform: process.platform,
          },
        },
      },
      exitOnError: workflow ? true : false,
    });

    this.setConsoleTransport();
    this.setRoutineTransport();

    if (process.env.LOGTAIL_TOKEN)
      this.setLogtailTransport(process.env.LOGTAIL_TOKEN);
  }

  /**
   * Initializes a console transport for the Winston logging utility.
   * @function
   * @see {@link https://www.npmjs.com/package/winston winston}
   * @since 3.0.0
   * @access private
   * @returns {void}
   */
  private setConsoleTransport(): void {
    const formation = (info: winston.Logform.TransformableInfo) =>
      `${info.timestamp} [${info.level}] ${info.message}`;
    const transport = new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize({ all: false }),
        winston.format.timestamp({ format: "YYYY.MM.DD-HH:mm:ss" }),
        winston.format.errors({ stack: false }),
        winston.format.align(),
        winston.format.printf(formation)
      ),
    });

    if (development) this.logger.add(transport);
  }

  /**
   * Initializes a Logtail transport for the Winston logging utility.
   * @function
   * @see {@link https://betterstack.com/docs/logs/start/ Better Stack}
   * @since 3.0.0
   * @param {string} ENV_VARIABLE_TOKEN Logtail source token
   * @access private
   * @returns {void}
   */
  private setLogtailTransport(ENV_VARIABLE_TOKEN: string): void {
    const applicant = new Logtail(ENV_VARIABLE_TOKEN);
    const transport = new LogtailTransport(applicant);

    if (production) this.logger.add(transport);
  }

  /**
   * Initializes a DailyRotateFile transport for the Winston logging utility.
   * @function
   * @see {@link https://www.npmjs.com/package/winston-daily-rotate-file winston-daily-rotate-file}
   * @since 3.0.0
   * @access private
   * @returns {void}
   */
  private setRoutineTransport(): void {
    const transport = new winston.transports.DailyRotateFile({
      utc: false,
      format: winston.format.combine(
        winston.format.timestamp({ format: "YYYY.MM.DD-HH:mm:ss" }),
        winston.format.errors({ stack: true }),
        winston.format.json()
      ),
      stream: undefined,
      maxSize: "256m",
      dirname: production ? "./server" : "./logs",
      options: { flags: "a" },
      maxFiles: "3d",
      filename: "MIQOBOT-%DATE%",
      extension: ".log",
      frequency: undefined,
      datePattern: "YYYY-MM-DD",
      symlinkName: "current.log",
      auditHashType: "sha256",
      createSymlink: false,
      zippedArchive: true,
    });

    if (!workflow) this.logger.add(transport);
  }
}

export default Winston;
