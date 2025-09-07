import { config } from '@repo/config';
import { logger } from '@repo/logs';
import { sendEmail } from '@repo/mail';
import { Hono } from 'hono';
import { describeRoute } from 'hono-openapi';
import { resolver, validator } from 'hono-openapi/zod';
import { z } from 'zod';
import { localeMiddleware } from '../../middleware/locale';
import { authMiddleware } from '../../middleware/auth';
import { contactFormSchema } from './types';

export const contactRouter = new Hono()
  .basePath('/contact')
  .post(
    '/',
    localeMiddleware,
    validator('form', contactFormSchema),
    describeRoute({
      tags: ['Contact'],
      summary: 'Send a message from the contact form',
      description: 'Send a message with an email and name',
      responses: {
        204: {
          description: 'Message sent'
        },
        400: {
          description: 'Could not send message',
          content: {
            'application/json': {
              schema: resolver(z.object({ error: z.string() }))
            }
          }
        }
      }
    }),
    async (c) => {
      const { email, name, message } = c.req.valid('form');
      const locale = c.get('locale');

      try {
        await sendEmail({
          to: config.contactForm.to,
          locale,
          subject: config.contactForm.subject,
          text: `Name: ${name}\n\nEmail: ${email}\n\nMessage: ${message}`
        });

        return c.body(null, 204);
      } catch (error) {
        logger.error(error);
        return c.json({ error: 'Could not send email' }, 500);
      }
    }
  )
  .post(
    '/support',
    authMiddleware,
    validator(
      'json',
      z.object({
        type: z.enum(['bug', 'feature', 'improvement']),
        title: z.string().min(1, 'Title is required'),
        description: z.string().min(1, 'Description is required'),
        priority: z.enum(['low', 'medium', 'high']),
        email: z.string().email('Valid email is required'),
        organizationId: z.string().optional()
      })
    ),
    describeRoute({
      tags: ['Contact'],
      summary: 'Submit a support request',
      description:
        'Submit a bug report, feature request, or improvement suggestion',
      responses: {
        200: {
          description: 'Support request sent successfully',
          content: {
            'application/json': {
              schema: resolver(
                z.object({
                  success: z.boolean(),
                  message: z.string(),
                  type: z.string()
                })
              )
            }
          }
        },
        400: {
          description: 'Invalid request data',
          content: {
            'application/json': {
              schema: resolver(z.object({ error: z.string() }))
            }
          }
        },
        500: {
          description: 'Failed to send support request',
          content: {
            'application/json': {
              schema: resolver(z.object({ error: z.string() }))
            }
          }
        }
      }
    }),
    async (c: any) => {
      try {
        const { type, title, description, priority, email, organizationId } =
          c.req.valid('json');
        const user = c.get('user');

        // Create email content
        const typeLabel =
          type === 'bug'
            ? 'Bug Report'
            : type === 'feature'
              ? 'Feature Request'
              : 'Improvement Suggestion';
        const priorityLabel =
          priority === 'low'
            ? 'Low - Nice to have'
            : priority === 'medium'
              ? 'Medium - Would be helpful'
              : 'High - Important for workflow';

        const emailSubject = `[${typeLabel.toUpperCase()}] ${title}`;

        const emailHtml = `
          <h2>New ${typeLabel} from Writelyy User</h2>
          
          <h3>Request Details:</h3>
          <ul>
            <li><strong>Type:</strong> ${typeLabel}</li>
            <li><strong>Priority:</strong> ${priorityLabel}</li>
            <li><strong>Title:</strong> ${title}</li>
            <li><strong>User Email:</strong> ${email}</li>
            ${user?.name ? `<li><strong>User Name:</strong> ${user.name}</li>` : ''}
            ${organizationId ? `<li><strong>Organization ID:</strong> ${organizationId}</li>` : ''}
          </ul>

          <h3>Description:</h3>
          <div style="background-color: #f5f5f5; padding: 16px; border-radius: 8px; border-left: 4px solid #3b82f6;">
            ${description.replace(/\n/g, '<br>')}
          </div>

          <hr style="margin: 24px 0;">
          
          <p style="color: #666; font-size: 14px;">
            This request was submitted through the Writelyy support form.
            Please respond to the user at: <a href="mailto:${email}">${email}</a>
          </p>
        `;

        // Send email to team
        const emailSent = await sendEmail({
          to: 'team@writelyy.app', // Update this to your team email
          subject: emailSubject,
          html: emailHtml
        });

        if (!emailSent) {
          return c.json({ error: 'Failed to send support request' }, 500);
        }

        // Log the request for analytics (optional)
        logger.log(
          `📧 Support request sent: ${typeLabel} - "${title}" from ${email}`
        );

        return c.json({
          success: true,
          message:
            "Your support request has been sent successfully! We'll get back to you within 24-48 hours.",
          type: typeLabel
        });
      } catch (error) {
        logger.error('❌ Support request error:', error);
        return c.json(
          {
            error: 'Failed to submit support request',
            details: error instanceof Error ? error.message : 'Unknown error'
          },
          500
        );
      }
    }
  );
