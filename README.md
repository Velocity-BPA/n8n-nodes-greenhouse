# n8n-nodes-greenhouse

> **[Velocity BPA Licensing Notice]**
>
> This n8n node is licensed under the Business Source License 1.1 (BSL 1.1).
>
> Use of this node by for-profit organizations in production environments requires a commercial license from Velocity BPA.
>
> For licensing information, visit https://velobpa.com/licensing or contact licensing@velobpa.com.

A comprehensive n8n community node for Greenhouse ATS (Applicant Tracking System), providing complete integration with the Greenhouse Harvest API and Job Board API. Manage candidates, applications, jobs, offers, interviews, scorecards, and more through n8n workflows.

![n8n](https://img.shields.io/badge/n8n-community--node-orange)
![Greenhouse](https://img.shields.io/badge/Greenhouse-ATS-green)
![License](https://img.shields.io/badge/license-BSL--1.1-blue)

## Features

- **16 Resource Categories** - Complete coverage of Greenhouse API resources
- **100+ Operations** - Full CRUD operations plus specialized actions
- **Harvest API v1** - Full integration with Greenhouse's internal API
- **Job Board API** - Public job board operations
- **Webhook Triggers** - Real-time event notifications
- **GDPR Compliance** - Candidate anonymization support
- **Pagination Support** - Cursor-based pagination for large datasets

## Installation

### Community Nodes (Recommended)

1. Open n8n
2. Go to **Settings** → **Community Nodes**
3. Click **Install**
4. Enter `n8n-nodes-greenhouse`
5. Click **Install**

### Manual Installation

```bash
# Navigate to your n8n installation
cd ~/.n8n

# Install the package
npm install n8n-nodes-greenhouse
```

### Development Installation

```bash
# Clone the repository
git clone https://github.com/Velocity-BPA/n8n-nodes-greenhouse.git
cd n8n-nodes-greenhouse

# Install dependencies
npm install

# Build the project
npm run build

# Link to n8n
npm link
cd ~/.n8n
npm link n8n-nodes-greenhouse
```

## Credentials Setup

### Greenhouse API Credentials

| Field | Description | Required |
|-------|-------------|----------|
| API Key | Your Greenhouse Harvest API key | Yes |
| On-Behalf-Of User ID | User ID for write operations (audit trail) | Yes (for writes) |
| Board Token | Public job board token | No |
| Harvest Base URL | API base URL (default: https://harvest.greenhouse.io/v1) | No |
| Job Board Base URL | Job Board API URL (default: https://boards-api.greenhouse.io/v1) | No |

### Getting Your API Key

1. Log into Greenhouse as an admin
2. Navigate to **Configure** → **Dev Center** → **API Credential Management**
3. Click **Create New API Key**
4. Select **Harvest API** and configure permissions
5. Copy the API key

## Resources & Operations

### Candidates
- List, Get, Create, Update, Delete
- Anonymize (GDPR compliance)
- Merge duplicate candidates
- Add attachments, notes, and emails
- Get activity feed

### Applications
- List, Get, Create, Update, Delete
- Advance to next stage
- Move to specific stage
- Reject/Unreject
- Hire candidate
- Transfer to different job

### Jobs
- List, Get, Create, Update
- List job stages
- Manage job openings (create, update, close)
- Get hiring team

### Job Posts
- List, Get, Update
- List application questions

### Offers
- List, Get, Create, Update
- Get current offer for application

### Scorecards
- List, Get, Create, Update
- Overall recommendations
- Attribute ratings

### Interviews
- List, Get, Create, Update, Delete
- Schedule with interviewers
- Video conferencing integration

### Users
- List, Get, Create
- Get current user
- Enable/Disable users
- Update permissions

### Departments & Offices
- List, Get, Create, Update

### Sources
- List, Get

### Custom Fields
- List, Get
- Add options to select fields

### Tags
- List candidate tags
- Add/Remove tags from candidates
- List application tags

### EEOC
- Get EEOC data for applications

### Approval Flows
- Get, Create, Update
- Request approval

### Job Board (Public API)
- List boards
- Get board info
- List/Get board jobs
- List departments/offices
- Submit applications

## Trigger Node

The **Greenhouse Trigger** node listens for webhook events:

| Event | Description |
|-------|-------------|
| Candidate Created | New candidate added |
| Candidate Hired | Candidate hired |
| Candidate Stage Changed | Application moves stages |
| Application Created | New application submitted |
| Application Updated | Application modified |
| Interview Scheduled | Interview scheduled |
| Offer Created/Updated | Offer lifecycle events |
| Scorecard Submitted | Interview feedback submitted |
| Rejection Sent | Rejection email sent |

### Webhook Setup

1. Add the Greenhouse Trigger node to your workflow
2. Copy the webhook URL
3. In Greenhouse: **Configure** → **Dev Center** → **Webhooks**
4. Create a webhook with the copied URL
5. Select the events to listen for
6. Copy the secret key to the trigger node (optional but recommended)

## Usage Examples

### Create a Candidate

```javascript
// Greenhouse node configuration
{
  "resource": "candidate",
  "operation": "create",
  "firstName": "John",
  "lastName": "Doe",
  "emails": "john.doe@example.com",
  "additionalFields": {
    "phoneNumbers": "555-123-4567",
    "company": "Acme Inc",
    "title": "Software Engineer"
  }
}
```

### Advance Application

```javascript
// Move application to next stage
{
  "resource": "application",
  "operation": "advance",
  "applicationId": 12345
}
```

### Schedule Interview

```javascript
{
  "resource": "interview",
  "operation": "create",
  "applicationId": 12345,
  "interviewerIds": "67890,67891",
  "startTime": "2024-02-01T10:00:00Z",
  "endTime": "2024-02-01T11:00:00Z"
}
```

## Greenhouse Concepts

| Concept | Description |
|---------|-------------|
| Candidate | A person who may apply for jobs |
| Application | A candidate's application to a specific job |
| Job | A job requisition or opening |
| Stage | A step in the hiring pipeline |
| Scorecard | Interview feedback and rating |
| Opening | A specific position within a job |
| Source | Where a candidate was found |
| On-Behalf-Of | User ID for audit trail on write operations |

## Error Handling

The node provides detailed error messages for common issues:

- **401 Unauthorized**: Invalid API key
- **403 Forbidden**: Missing On-Behalf-Of header or insufficient permissions
- **404 Not Found**: Resource doesn't exist
- **422 Unprocessable Entity**: Validation errors
- **429 Too Many Requests**: Rate limit exceeded

## Security Best Practices

1. **API Key Security**: Store API keys securely using n8n credentials
2. **On-Behalf-Of Header**: Always configure for audit trails
3. **Webhook Signatures**: Enable signature verification for webhooks
4. **Minimal Permissions**: Use API keys with only required permissions
5. **GDPR Compliance**: Use anonymization for data subject requests

## Development

```bash
# Install dependencies
npm install

# Build
npm run build

# Watch mode
npm run dev

# Lint
npm run lint

# Test
npm test

# Test with coverage
npm run test:coverage
```

## Author

**Velocity BPA**
- Website: [velobpa.com](https://velobpa.com)
- GitHub: [Velocity-BPA](https://github.com/Velocity-BPA)

## Licensing

This n8n community node is licensed under the **Business Source License 1.1**.

### Free Use
Permitted for personal, educational, research, and internal business use.

### Commercial Use
Use of this node within any SaaS, PaaS, hosted platform, managed service, or paid automation offering requires a commercial license.

For licensing inquiries:
**licensing@velobpa.com**

See [LICENSE](LICENSE), [COMMERCIAL_LICENSE.md](COMMERCIAL_LICENSE.md), and [LICENSING_FAQ.md](LICENSING_FAQ.md) for details.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## Support

- [GitHub Issues](https://github.com/Velocity-BPA/n8n-nodes-greenhouse/issues)
- [Greenhouse API Documentation](https://developers.greenhouse.io/)
- [n8n Community](https://community.n8n.io/)

## Acknowledgments

- [Greenhouse](https://www.greenhouse.io/) for their comprehensive ATS platform
- [n8n](https://n8n.io/) for the workflow automation platform
- The open source community for inspiration and support
