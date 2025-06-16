# 🧪 Leddiprime Daily Payment QA Automation

This project automates the end-to-end quality assurance process for daily customer payment allocation from bank transactions to the Leddiprime system using mocked APIs and comprehensive Jest test scenarios.

## 📌 Overview

### Daily Payment Flow

Every day, the following process occurs:

1. **Payment Confirmation** - Admin confirms payment on bank website
2. **Data Export** - Transaction log exported as CSV from bank
3. **Data Upload** - CSV uploaded to Google Sheets for processing
4. **Customer Mapping** - System maps transactions to customers using Acquire IDs
5. **Fund Allocation** - Allocations made to customer accounts on Leddiprime

### What This Project Tests

This automation suite validates the entire flow by verifying:

- ✅ Bank CSV data parsing accuracy
- 🔍 Acquire ID identification and validation
- 👤 Customer account retrieval and verification
- 💰 Successful fund allocations
- 🛡️ Graceful error handling and failure scenarios

## 🏗️ Project Structure

```
qa_test/
├── mocks/                    # Mock implementations
│   └── apis.ts              # Bank & Leddiprime API mocks
├── test/
│   └── paymentFlow.test.ts  # Main Jest test suite
├── utils/
│   ├── dataHandlers.ts      # CSV parsing & Google Sheets logic
│   ├── leddiServices.ts     # Acquire ID mapping & fund allocation
│   └── notifications.ts     # Alert mechanisms for failures
├── runDailyTest.ts          # CLI test execution script
├── jest.config.ts           # Jest configuration
├── package.json
├── tsconfig.json
└── README.md
```

## 🚀 Quick Start

### Prerequisites

- Node.js 16+
- npm or yarn
- TypeScript knowledge

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd leddiprime-qa-automation

# Install dependencies
npm install

# Install dev dependencies
npm install --save-dev ts-node jest @types/jest typescript @types/node
```

### Environment Setup

Create a `.env` file in the root directory:

```env
# Optional: Configure for real API testing
BANK_API_URL=https://bank-api.example.com
LEDDIPRIME_API_URL=https://api.leddiprime.com
GOOGLE_SHEETS_API_KEY=your_api_key_here
SLACK_WEBHOOK_URL=your_slack_webhook_url
```

## ▶️ Usage

### Run Complete Daily QA Flow

```bash
# Execute full payment flow simulation
npm run test:daily

# Or using ts-node directly
npx ts-node runDailyTest.ts
```

### Development Testing

```bash
# Run all Jest tests
npm test

# Run tests with verbose output
npm run test:verbose

# Run tests in watch mode for development
npm run test:watch

# Run specific test file
npx jest paymentFlow.test.ts
```

### Package.json Scripts

Add these scripts to your `package.json`:

```json
{
  "scripts": {
    "test": "jest",
    "test:verbose": "jest --verbose",
    "test:watch": "jest --watch",
    "test:daily": "ts-node runDailyTest.ts",
    "test:ci": "jest --ci --coverage --watchAll=false"
  }
}
```

## 🧪 Test Scenarios

| Scenario                     | Description                                       | Expected Outcome                                  |
| ---------------------------- | ------------------------------------------------- | ------------------------------------------------- |
| ✅ **End-to-End Success**    | Complete flow from CSV to successful allocation   | All transactions processed correctly              |
| ⚠️ **Missing Acquire IDs**   | Customer mappings not found for some transactions | Graceful handling with detailed error reporting   |
| ❌ **Malformed CSV Data**    | Invalid or incomplete CSV structure               | Robust parsing with clear validation errors       |
| 💥 **API Service Failure**   | Leddiprime API unavailable or returning errors    | Proper error handling and retry mechanisms        |
| 🟡 **Partial Allocation**    | Mixed success/failure scenario                    | Successful transactions complete, failures logged |
| 🔒 **Authentication Issues** | Invalid API credentials or expired tokens         | Clear authentication error messages               |
| 📊 **Large Dataset**         | Processing high volume of transactions            | Performance validation and memory management      |

### Test Coverage

The test suite covers:

- Input validation and sanitization
- Error boundary testing
- Mock API response scenarios
- Data transformation accuracy
- Notification system functionality

## 🔧 Configuration & Customization

### Mock API Configuration

Customize mock behaviors in `mocks/apis.ts`:

```typescript
// Override mock implementation for specific tests
function overrideMock(mockFn: jest.Mock, implementation: any) {
  mockFn.mockImplementation(implementation);
}

// Example: Simulate API failure
overrideMock(getCustomerByAcquireId, () => {
  throw new Error("Customer service unavailable");
});
```

### Notification Configuration

Extend notification capabilities in `utils/notifications.ts`:

```typescript
export async function notifyFailure(error: Error, context: any) {
  // Slack integration
  await sendSlackAlert(error.message);

  // Email notifications
  await sendEmailAlert(error, context);

  // PagerDuty integration
  await triggerPagerDutyAlert(error);
}
```

### Jest Configuration

Customize test behavior in `jest.config.ts`:

```typescript
export default {
  preset: "ts-jest",
  testEnvironment: "node",
  collectCoverageFrom: ["utils/**/*.ts", "mocks/**/*.ts", "!**/*.d.ts"],
  coverageReporters: ["text", "lcov", "html"],
  testTimeout: 30000,
};
```

## 🔍 Monitoring & Reporting

### Test Reports

- Coverage reports generated in `coverage/` directory
- Test results logged to console with detailed output
- Failed test screenshots and logs preserved

### Daily Monitoring

Set up automated daily runs using:

- **GitHub Actions** - `.github/workflows/daily-qa.yml`
- **Jenkins** - Scheduled pipeline execution
- **Cron Jobs** - Server-based scheduling

### Metrics Tracked

- Test execution time
- Success/failure rates
- API response times
- Data processing accuracy

## 🛠️ Troubleshooting

### Common Issues

**ESM vs CommonJS conflicts:**

```bash
# Use experimental VM modules if needed
node --experimental-vm-modules node_modules/.bin/jest
```

**TypeScript compilation errors:**

```bash
# Ensure tsconfig.json includes test files
npx tsc --noEmit
```

**Mock not working:**

```typescript
// Ensure mocks are properly imported
jest.mock("./path/to/module");
```

### Debug Mode

Enable detailed logging:

```bash
DEBUG=leddiprime:* npm run test:daily
```

## 🚀 Future Enhancements

### Planned Features

- [ ] CI/CD pipeline integration
- [ ] Real bank API integration (sandbox mode)
- [ ] Advanced reporting dashboard
- [ ] Performance benchmarking
- [ ] Multi-environment testing
- [ ] Automated regression testing

### Integration Opportunities

- **Monitoring**: DataDog, New Relic integration
- **Alerting**: Enhanced Slack/Teams notifications
- **Reporting**: Custom dashboard for QA metrics
- **Security**: API key rotation and secure storage

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Code Style

- Use TypeScript strict mode
- Follow existing naming conventions
- Add tests for new features
- Update documentation as needed

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Team

**QA Automation Team**

- Lead: [Martins Aguegbodo] - [aguegbodomartins@gmail.com]


**Support**: For issues or questions, contact the QA team or open an issue in this repository.
