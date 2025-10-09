# Deployment & Rollback Strategy - Enhancement Plan

**Status**: ⚠️ PARTIAL (75% compliance)
**Priority**: Must-fix before Epic 2
**Estimated Effort**: 1 day
**Author**: Winston (Architect)
**Date**: 2025-01-10

---

## Gap Analysis

### Current State
- Automated deployments via Vercel
- Database migrations versioned
- **Critical Gap**: No rollback procedures, no disaster recovery

---

## Enhancement Plan

### Rollback Procedures (Day 1 Morning)

#### Frontend Rollback (Vercel)
```bash
# Option 1: Revert to previous deployment via Vercel dashboard
# Deployments > [Select previous] > Promote to Production

# Option 2: Git revert + redeploy
git revert HEAD
git push origin main
# Vercel auto-deploys reverted commit
```

#### Database Migration Rollback
```sql
-- Create down migrations for every up migration
-- Example: 20250110000002_add_tiers.sql
BEGIN;

-- Down migration
DROP TABLE IF EXISTS pricing_tiers;

COMMIT;
```

**Policy**: Every migration must have a rollback script tested in staging

### Disaster Recovery (Day 1 Afternoon)

#### Backup Strategy
- **Supabase Auto-Backups**: Daily (retained 7 days on free tier)
- **Manual Backups**: Before major migrations
- **Restoration Testing**: Monthly in staging environment

#### Recovery Procedures
1. **Database Restore** (Supabase Dashboard > Database > Backups)
2. **Frontend Rollback** (Vercel previous deployment)
3. **Verify Integrity** (Run smoke tests)
4. **Communicate** (Notify users)

---

## Architecture Section Addition

```markdown
## Deployment & Rollback Strategy

### Deployment Pipeline
1. Push to `main` → GitHub Actions (lint, type-check, test)
2. Pass → Vercel auto-deploy to production
3. Migrations → Run manually via Supabase Dashboard SQL Editor

### Rollback Procedures

#### Frontend Rollback
- Vercel: Promote previous deployment (instant)
- Git: Revert commit + push (1-2 minutes)

#### Database Rollback
- Run down migration script
- Restore from backup if needed (5-10 minutes)

### Disaster Recovery
- **RPO** (Recovery Point Objective): 24 hours (daily backups)
- **RTO** (Recovery Time Objective): 1 hour (manual restore)
- **Backup Testing**: Monthly in staging
```

---

## Validation Criteria
- [ ] Rollback procedures documented
- [ ] Down migrations created for all migrations
- [ ] Disaster recovery runbook created
- [ ] Backup restoration tested in staging
