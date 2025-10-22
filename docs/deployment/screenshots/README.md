# Playwright Test Screenshots

This directory stores screenshots captured during automated Playwright browser testing of the Vercel production deployment.

## Screenshot Naming Convention

- **production-login-page.png**: Initial login page snapshot
- **production-verified.png**: Full page screenshot after verification
- **production-error-[timestamp].png**: Error screenshots (if issues detected)
- **production-test-[date].png**: Test session screenshots

## Screenshot Purpose

Screenshots serve as:
1. **Visual Evidence**: Proof that deployment was tested
2. **Documentation**: Record of what the production site looks like
3. **Debugging**: Visual reference when troubleshooting issues
4. **Historical Record**: Track visual changes over time

## How Screenshots Are Generated

Screenshots are automatically captured by Playwright MCP tools during the deployment verification process:

```typescript
// Example Playwright command
mcp__playwright__browser_take_screenshot
filename: "docs/deployment/screenshots/production-login-page.png"
type: "png"
```

## Viewing Screenshots

Screenshots can be viewed in:
- **Windows**: File Explorer
- **VS Code**: Preview directly in editor
- **Documentation**: Embedded in test reports

## Test Reports

Detailed test reports that reference these screenshots are located in:
- `docs/deployment/test-results-[DATE].md`

---

**Note**: This directory will be populated after the user completes Vercel deployment and DevOps executes Playwright tests.
