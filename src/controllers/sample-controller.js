import express from 'express';
import HttpError from '../errors/http-error';

export default class SampleController {
  static middleware(controller) {
    return express
      .Router()
      .use((req, res, next) => {
        // istanbul ignore next
        if (!req.controller) {
          req.controller = controller || new SampleController();
        }
        next();
      })
      .get('/:id', (req, res) => req.controller.reply(req, res));
  }

  async reply(req, res) {
    const { id } = req.params;
    const { message } = req.query;

    try {
      if (!message) {
        throw new HttpError('Message is required', 400);
      }

      res.json({
        data: {
          id,
          type: 'response',
          attributes: { message },
        },
      });
    } catch (error) {
      req.log.error('Error', error, { id, message });
      res.jsonError(error);
    }

  }
}
