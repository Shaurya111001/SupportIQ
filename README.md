# SupportIQ - AI-Powered Customer Support Platform

SupportIQ is a multi-tenant, AI-powered customer support mobile application that integrates with WhatsApp Business via Meta's Cloud API. The platform provides automated conversation analysis, intent classification, and real-time message synchronization.

## 🚀 Features

### Core Functionality
- **Multi-tenant Architecture**: Complete tenant isolation for businesses
- **WhatsApp Business Integration**: Seamless connection via Meta OAuth
- **AI-Powered Analysis**: Conversation summarization and intent classification
- **Real-time Sync**: WebSocket-based message synchronization
- **Secure Data Handling**: Automatic masking of sensitive information

### Mobile App Features
- **Modern React Native UI**: Built with Expo and TypeScript
- **Tab-based Navigation**: Inbox, Analytics, and Profile sections
- **Real-time Updates**: Live message notifications
- **Conversation Management**: Detailed message history with AI insights
- **Analytics Dashboard**: AI-generated business insights

### Backend Features
- **RESTful API**: Express.js with PostgreSQL
- **Webhook Handling**: Secure WhatsApp message processing
- **AI Integration**: Ready for OpenAI/Mistral integration
- **WebSocket Server**: Real-time communication
- **Data Security**: Encrypted credentials and tenant isolation

## 🏗 Architecture

```
├── app/                    # React Native Mobile App
│   ├── (tabs)/            # Tab navigation screens
│   ├── auth/              # Authentication screens
│   ├── conversation/      # Conversation detail screen
│   └── _layout.tsx        # Root layout with auth provider
├── context/               # React context providers
├── services/              # API client services
├── backend/               # Node.js Express API
│   ├── routes/            # API route handlers
│   ├── services/          # Business logic services
│   ├── middleware/        # Authentication middleware
│   ├── config/            # Database configuration
│   └── utils/             # Utility functions
```

## 🛠 Tech Stack

### Mobile App
- **React Native** with Expo SDK 52
- **TypeScript** for type safety
- **Expo Router** for navigation
- **Lucide React Native** for icons
- **AsyncStorage** for local data

### Backend
- **Node.js** with Express.js
- **PostgreSQL** with connection pooling
- **WebSockets** for real-time communication
- **JWT** for authentication
- **bcryptjs** for password hashing

### External Integrations
- **Meta WhatsApp Cloud API** for messaging
- **OpenAI/Mistral** for AI processing (configurable)

## 🚦 Getting Started

### Prerequisites
- Node.js 18+ installed
- PostgreSQL database
- Meta WhatsApp Business account (for production)
- Expo CLI installed globally

### Installation

1. **Clone and install dependencies**
```bash
npm install
cd backend && npm install
```

2. **Set up environment variables**
```bash
# Copy example environment files
cp backend/.env.example backend/.env
```

3. **Configure the backend environment**
Edit `backend/.env` with your database and API keys:
```env
DATABASE_URL=postgresql://username:password@localhost:5432/supportiq
JWT_SECRET=your-super-secret-jwt-key-here
WHATSAPP_WEBHOOK_SECRET=your-whatsapp-webhook-secret
WEBHOOK_BASE_URL=https://your-domain.com
```

4. **Initialize the database**
```bash
cd backend
npm run init-db
```

5. **Start the development servers**

Backend:
```bash
cd backend
npm run dev
```

Mobile app:
```bash
npm run dev
```

## 📱 Usage

### For Businesses

1. **Sign Up**: Create a business account with company details
2. **Connect WhatsApp**: Link your WhatsApp Business account via OAuth
3. **Receive Messages**: Customer messages automatically appear in the inbox
4. **AI Insights**: View conversation summaries and intent classifications
5. **Analytics**: Monitor customer interaction patterns and trends

### Webhook Setup

For production deployment, configure your WhatsApp Business webhook URL:
```
https://your-domain.com/webhook/whatsapp/{tenant_id}
```

## 🔒 Security Features

- **Data Masking**: Automatic removal of sensitive information before AI processing
- **Tenant Isolation**: Complete data separation between businesses
- **Encrypted Storage**: Secure credential management
- **Webhook Verification**: Signature validation for Meta webhooks
- **JWT Authentication**: Secure API access

## 🤖 AI Integration

The platform supports multiple AI providers:

### OpenAI Integration
```javascript
const response = await openai.completions.create({
  model: "gpt-3.5-turbo",
  messages: maskedMessages,
  max_tokens: 150
});
```

### Mistral Integration
Replace the AI service configuration to use Mistral's API for conversation analysis.

## 🔧 Configuration

### WhatsApp Business Setup

1. Create a Meta Developer account
2. Set up WhatsApp Business application
3. Configure webhook endpoints
4. Implement OAuth flow for business connections

### Database Schema

The application uses a multi-tenant PostgreSQL schema:
- `tenants`: Business accounts and credentials
- `contacts`: Customer contact information
- `conversations`: Chat sessions with AI analysis
- `messages`: Individual messages with metadata
- `webhook_events`: Event logs for debugging

## 📊 Analytics & Insights

SupportIQ provides comprehensive analytics:
- **Conversation Volume**: Daily/weekly message trends
- **Intent Analysis**: Most common customer intents
- **Response Metrics**: Average response times
- **AI Performance**: Processing accuracy and confidence

## 🚀 Deployment

### Backend Deployment
- Deploy to any Node.js hosting provider
- Configure PostgreSQL database
- Set up environment variables
- Enable HTTPS for webhook security

### Mobile App Deployment
- Build with Expo Application Services (EAS)
- Deploy to App Store and Google Play
- Configure push notifications for real-time alerts

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:
- Create an issue in the GitHub repository
- Check the documentation for common solutions
- Contact the development team

---

Built with ❤️ by the SupportIQ Team