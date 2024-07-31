import type { TutorialEntryType } from '../../../tutorial/tutorialContentPlugin.ts'
import type { useNavigation } from '../../context/Navigation.js'
import { encode } from '../../context/navigation/encodeNavigation.ts'

export const isDone = (
	tutorial: TutorialEntryType,
	location: ReturnType<typeof useNavigation>,
): boolean => {
	const done = tutorial.done
	if (done === undefined) return false
	if ((encode(location.current())?.includes(done) ?? false) === false)
		return false
	return true
}
