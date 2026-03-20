<script lang="ts">
	import { Rectangle, Sprite, SpineProvider, SpineTrack } from 'pixi-svelte';
	import { FadeContainer } from 'components-pixi';
	import { SECOND } from 'constants-shared/time';

	import { getContext } from '../game/context';
	import {
		BACKGROUND_RATIO,
		PORTRAIT_BACKGROUND_RATIO,
	} from '../game/constants';

	const context = getContext();
	const backgroundProps = $derived(
		context.stateLayoutDerived.normalBackgroundLayout({ scale: 0.5 }),
	);
	const showBaseBackground = $derived(context.stateGame.gameType === 'basegame');
	const showFeatureBackground = $derived(context.stateGame.gameType === 'freegame');

	const backgroundCoverProps = $derived.by(() => {
		const canvas = context.stateLayoutDerived.canvasSizes();
		const canvasRatio = canvas.width / canvas.height;
		// Use physical canvas shape - on iPhone layoutType is forced to 'landscape' but canvas can be portrait
		// longHeight: tall screens (iPhone portrait). almostSquare: pick by ratio. longWidth: wide screens
		const ratio =
			context.stateLayoutDerived.canvasRatioType() === 'longHeight'
				? PORTRAIT_BACKGROUND_RATIO
				: canvasRatio < 1
					? PORTRAIT_BACKGROUND_RATIO
					: BACKGROUND_RATIO;
		const scale = Math.max(canvas.width / ratio, canvas.height);
		return {
			x: canvas.width / 2,
			y: canvas.height / 2,
			width: ratio * scale,
			height: scale,
			anchor: 0.5,
		};
	});
</script>

<Rectangle {...context.stateLayoutDerived.canvasSizes()} backgroundColor={0x000000} zIndex={-3} />

<FadeContainer show={showBaseBackground} duration={SECOND} zIndex={-2}>
	<Sprite key="background" anchor={0.5} roundPixels {...backgroundCoverProps} />
</FadeContainer>

<FadeContainer show={showFeatureBackground} duration={SECOND} zIndex={-1}>
	<SpineProvider key="foregroundFeatureAnimation" {...backgroundProps}>
		<SpineTrack trackIndex={0} animationName={'idle'} loop />
	</SpineProvider>
	<SpineProvider key="foregroundFeatureAnimation" {...backgroundProps}>
		<SpineTrack trackIndex={0} animationName={'dust'} loop />
	</SpineProvider>
</FadeContainer>
