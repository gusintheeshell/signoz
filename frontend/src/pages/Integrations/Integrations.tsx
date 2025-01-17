import './Integrations.styles.scss';

import useAnalytics from 'hooks/analytics/useAnalytics';
import useUrlQuery from 'hooks/useUrlQuery';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';

import Header from './Header';
import IntegrationDetailPage from './IntegrationDetailPage/IntegrationDetailPage';
import IntegrationsList from './IntegrationsList';
import { INTEGRATION_TELEMETRY_EVENTS } from './utils';

function Integrations(): JSX.Element {
	const urlQuery = useUrlQuery();
	const history = useHistory();
	const location = useLocation();

	const { trackEvent } = useAnalytics();

	const selectedIntegration = useMemo(() => urlQuery.get('integration'), [
		urlQuery,
	]);

	const setSelectedIntegration = useCallback(
		(integration: string | null) => {
			if (integration) {
				trackEvent(INTEGRATION_TELEMETRY_EVENTS.INTEGRATIONS_ITEM_LIST_CLICKED, {
					integration,
				});
				urlQuery.set('integration', integration);
			} else {
				urlQuery.set('integration', '');
			}
			const generatedUrl = `${location.pathname}?${urlQuery.toString()}`;
			history.push(generatedUrl);
		},
		[history, location.pathname, trackEvent, urlQuery],
	);

	const [activeDetailTab, setActiveDetailTab] = useState<string | null>(
		'overview',
	);

	useEffect(() => {
		trackEvent(INTEGRATION_TELEMETRY_EVENTS.INTEGRATIONS_LIST_VISITED);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const [searchTerm, setSearchTerm] = useState<string>('');
	return (
		<div className="integrations-container">
			<div className="integrations-content">
				{selectedIntegration && activeDetailTab ? (
					<IntegrationDetailPage
						selectedIntegration={selectedIntegration}
						setSelectedIntegration={setSelectedIntegration}
						activeDetailTab={activeDetailTab}
					/>
				) : (
					<>
						<Header setSearchTerm={setSearchTerm} searchTerm={searchTerm} />
						<IntegrationsList
							setSelectedIntegration={setSelectedIntegration}
							searchTerm={searchTerm}
							setActiveDetailTab={setActiveDetailTab}
						/>
					</>
				)}
			</div>
		</div>
	);
}

export default Integrations;
