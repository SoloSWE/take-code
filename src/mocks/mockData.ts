import { AzureEntraGlobalSecureAccess, Github, Gitlab, Gmail, Instagram, Telegram } from "@thesvg/react";

export const socialIconsMap: Record<
	string,
	React.ComponentType<{ className?: string }>
> = {
	GitHub: Github,
	GitLab: Gitlab,
	Telegram: Telegram,
	Instagram: Instagram,
	Gmail: Gmail,
	Website: AzureEntraGlobalSecureAccess,
};

export const socialMedias = ['GitHub', 'GitLab', 'Telegram', 'Instagram', 'Gmail', 'Website'];