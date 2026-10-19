import { models } from '@hello.nrfcloud.com/proto-map/models'
import { For } from 'solid-js'
import { InfoBlock } from './InfoBlock.tsx'

export const ModelInfoBlock = () => {
	return (
		<InfoBlock title={<h3>Known models ({PROTO_VERSION})</h3>}>
			<div class="about add-device-flow">
				<ul>
					<For each={Object.values(models)}>
						{(model) => (
							<li>
								<code>{model.id}</code> ({model.about.title})
							</li>
						)}
					</For>
				</ul>
				<p>
					If your model is not available to select, you can add it by creating a
					PR against{' '}
					<a
						href={`https://github.com/hello-nrfcloud/proto-map/tree/${PROTO_VERSION}/models`}
						target="_blank"
					>
						our protocol repository
					</a>
					.
				</p>
			</div>
		</InfoBlock>
	)
}
