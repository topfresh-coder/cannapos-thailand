# Deployment & Rollback Strategy

## Deployment Pipeline

**Continuous Deployment** (main branch):
1. Push to `main` → GitHub Actions (lint, type-check, test, a11y)
2. All checks pass → Vercel auto-deploys to production
3. Database migrations → Run manually via Supabase Dashboard SQL Editor

**Preview Deployments** (PRs):
- Every PR gets preview URL
- Test changes before merge
- Share with stakeholders for review

## Rollback Procedures

### Frontend Rollback (Vercel)
**Option 1: Dashboard Rollback (Instant)**
1. Open Vercel dashboard → Deployments
2. Find previous successful deployment
3. Click "Promote to Production"
4. Verify app works correctly

**Option 2: Git Revert (1-2 minutes)**
```bash
git revert HEAD
git push origin main
# Vercel auto-deploys reverted commit
```

### Database Migration Rollback
**Requirement**: Every migration must have down migration

**Example**: `supabase/migrations/20250110000002_add_tiers_down.sql`
```sql
BEGIN;

-- Reverse migration
DROP TABLE IF EXISTS pricing_tiers;

COMMIT;
```

**Rollback Steps**:
1. Run down migration in Supabase SQL Editor
2. Verify data integrity
3. Test application functionality
4. If corruption: Restore from backup

### Disaster Recovery

**Backup Strategy**:
- **Supabase Auto-Backups**: Daily (7-day retention on free tier)
- **Manual Backups**: Before major migrations
- **Restoration Testing**: Monthly in staging environment

**Recovery Procedures**:
1. **Identify Issue** (monitoring alerts, user reports)
2. **Assess Severity** (data loss? partial outage? full outage?)
3. **Execute Rollback** (frontend or database or both)
4. **Restore from Backup** (if rollback insufficient)
5. **Verify Integrity** (smoke tests, sample transactions)
6. **Communicate** (notify users, document incident)

**Recovery Time Objectives**:
- **RPO** (Recovery Point Objective): 24 hours (daily backups)
- **RTO** (Recovery Time Objective): 1 hour (manual restore)

---
