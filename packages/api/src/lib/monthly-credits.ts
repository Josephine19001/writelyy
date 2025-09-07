import { db, addCreditsToOrganization } from '@repo/database';

export async function addMonthlyCreditsToAllOrganizations() {
  try {
    // Get all organizations
    const organizations = await db.organization.findMany({
      select: { id: true, name: true }
    });

    let successCount = 0;
    let errorCount = 0;

    // Add 100 credits to each organization
    for (const org of organizations) {
      try {
        await addCreditsToOrganization(
          org.id,
          100,
          'ADJUSTMENT',
          'Monthly credit allowance'
        );
        successCount++;
      } catch (error) {
        errorCount++;
        console.error(`❌ Failed to add credits to ${org.name}:`, error);
      }
    }

    return {
      total: organizations.length,
      success: successCount,
      errors: errorCount
    };
  } catch (error) {
    console.error('❌ Monthly credit addition failed:', error);
    throw error;
  }
}

// For manual execution
export async function addMonthlyCreditsToOrganization(organizationId: string) {
  try {
    await addCreditsToOrganization(
      organizationId,
      100,
      'ADJUSTMENT',
      'Monthly credit allowance'
    );
  } catch (error) {
    console.error('❌ Failed to add monthly credits:', error);
    throw error;
  }
}
