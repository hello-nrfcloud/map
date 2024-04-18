import { models } from '@hello.nrfcloud.com/proto-map'
import { For } from 'solid-js'
import { useViteEnv } from '../../context/ViteEnv.tsx'
import { InfoBlock } from '../InfoBlock.js'

export const ModelInfoBlock = () => {
	const { protoVersion } = useViteEnv()
	return (
		<InfoBlock title={<h3>Known models ({protoVersion})</h3>}>
			<div class="about add-device-flow">
				<p>
					All devices must use a well-known model definition. Below is a list of
					defined models.
				</p>
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
						href={`https://github.com/hello-nrfcloud/proto-map/tree/${protoVersion}/models`}
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
