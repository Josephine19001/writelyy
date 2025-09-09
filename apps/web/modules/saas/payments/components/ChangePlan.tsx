"use client";
import { PricingTable } from "@saas/payments/components/PricingTable";
import { SettingsItem } from "@saas/shared/components/SettingsItem";
import { useTranslations } from "next-intl";

export function ChangePlan({
	userId,
	activePlanId,
}: {
	userId?: string;
	activePlanId?: string;
}) {
	const t = useTranslations();

	return (
		<SettingsItem
			title={t("settings.billing.changePlan.title")}
			description={t("settings.billing.changePlan.description")}
			isColumn={true}
		>
			<PricingTable
				userId={userId}
				activePlanId={activePlanId}
				variant="compact"
			/>
		</SettingsItem>
	);
}
