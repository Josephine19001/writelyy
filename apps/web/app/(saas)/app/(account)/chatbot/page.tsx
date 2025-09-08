import { PageHeader } from "@saas/shared/components/PageHeader";

export default async function AiDemoPage() {
	return (
		<>
			<PageHeader
				title="AI Chatbot"
				subtitle="This is an example chatbot built with the OpenAI API"
			/>

			<div className="p-4">
				<p>AI Chatbot functionality is currently disabled.</p>
			</div>
		</>
	);
}
