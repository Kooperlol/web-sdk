<script lang="ts">
	import { stateUi } from 'state-shared';
	import { BLACK } from 'constants-shared/colors';
	import { MainContainer } from 'components-layout';
	import { Container, Rectangle, anchorToPivot } from 'pixi-svelte';

	import { DESKTOP_BASE_SIZE, DESKTOP_BACKGROUND_WIDTH_LIST } from '../constants';
	import { getContext } from '../context';
	import type { LayoutUiProps } from '../types';

	const props: LayoutUiProps = $props();
	const context = getContext();

	// All elements sit on a single horizontal bar. BTN_Y is the vertical center
	// for circular buttons; LBL_Y offsets text blocks so their visual midpoint
	// aligns with BTN_Y.
	const BTN_Y = DESKTOP_BASE_SIZE * 0.5;         // 67.5
	const LBL_Y = DESKTOP_BASE_SIZE * 0.5 - 30;    // 37.5 — top of stacked text, centers block around BTN_Y
	const ARROW_UP_Y = DESKTOP_BASE_SIZE * 0.5 - 20;  // 47.5 — aligned with label row
	const ARROW_DOWN_Y = DESKTOP_BASE_SIZE * 0.5 + 13; // 80.5 — aligned with value row
	const BAR_HEIGHT = 160;
</script>

<Container x={20}>
	{@render props.gameName()}
</Container>

<Container x={context.stateLayoutDerived.canvasSizes().width - 20}>
	{@render props.logo()}
</Container>

<MainContainer standard alignVertical="bottom">
	<!-- Dark background bar -->
	<Rectangle
		x={context.stateLayoutDerived.mainLayoutStandard().width * 0.15}
		y={context.stateLayoutDerived.mainLayoutStandard().height - BAR_HEIGHT}
		width={context.stateLayoutDerived.mainLayoutStandard().width / 1.5}
		height={BAR_HEIGHT}
		backgroundColor={0x0d0d1a}
		alpha={0.5}
	/>

	<Container
		x={context.stateLayoutDerived.mainLayoutStandard().width * 0.45}
		y={context.stateLayoutDerived.mainLayoutStandard().height - DESKTOP_BASE_SIZE - 10}
		pivot={anchorToPivot({
			anchor: { x: 0.5, y: 0 },
			sizes: {
				height: DESKTOP_BASE_SIZE,
				width: DESKTOP_BACKGROUND_WIDTH_LIST.reduce((sum, width) => sum + width, 0),
			},
		})}
	>
		<!-- ── Left group: BuyBonus (leftmost) then Menu ── -->
		<!-- <Container y={BTN_Y} x={220} scale={0.8}>
			{@render props.buttonBuyBonus({ anchor: 0.5 })}
		</Container> -->

		<Container y={BTN_Y} x={370} scale={0.8}>
			{@render props.buttonMenu({ anchor: 0.5 })}
		</Container>

		<!-- ── Centre labels: Balance · Win · Bet ── -->
		<Container y={LBL_Y} x={570} scale={0.8}>
			{@render props.amountBalance({ stacked: true })}
		</Container>

		<Container y={LBL_Y} x={820} scale={0.8}>
			{@render props.amountWin({ stacked: true })}
		</Container>

		<Container y={LBL_Y} x={1000} scale={0.8}>
			{@render props.amountBet({ stacked: true })}
		</Container>

		<!-- ── Bet arrows: stacked vertically to the right of the bet label ── -->
		<Container y={ARROW_UP_Y} x={1160} scale={0.42}>
			{@render props.buttonIncrease({ anchor: 0.5 })}
		</Container>

		<Container y={ARROW_DOWN_Y} x={1160} scale={0.42}>
			{@render props.buttonDecrease({ anchor: 0.5 })}
		</Container>

		<!-- ── Right group: AutoSpin · Spin (prominent) · Turbo ── -->
		<Container y={BTN_Y} x={1265} scale={0.72}>
			{@render props.buttonAutoSpin({ anchor: 0.5 })}
		</Container>

		<!-- Spin: full scale so it stands out as the primary CTA -->
		<Container y={BTN_Y} x={1405} scale={1.0}>
			{@render props.buttonBet({ anchor: 0.5 })}
		</Container>

		<Container y={BTN_Y} x={1535} scale={0.72}>
			{@render props.buttonTurbo({ anchor: 0.5 })}
		</Container>
	</Container>
</MainContainer>

{#if stateUi.menuOpen}
	<Rectangle
		eventMode="static"
		cursor="pointer"
		alpha={0.5}
		anchor={0.5}
		backgroundColor={BLACK}
		width={context.stateLayoutDerived.canvasSizes().width}
		height={context.stateLayoutDerived.canvasSizes().height}
		x={context.stateLayoutDerived.canvasSizes().width * 0.5}
		y={context.stateLayoutDerived.canvasSizes().height * 0.5}
		onpointerup={() => (stateUi.menuOpen = false)}
	/>

	<MainContainer standard alignVertical="bottom">
		<Container
			x={298}
			y={context.stateLayoutDerived.mainLayoutStandard().height - DESKTOP_BASE_SIZE - 10}
		>
			<Container scale={0.8} y={DESKTOP_BASE_SIZE * 0.5 - 150 - 170 * 3}>
				{@render props.buttonPayTable({ anchor: 0.5 })}
			</Container>

			<Container scale={0.8} y={DESKTOP_BASE_SIZE * 0.5 - 150 - 170 * 2}>
				{@render props.buttonGameRules({ anchor: 0.5 })}
			</Container>

			<Container scale={0.8} y={DESKTOP_BASE_SIZE * 0.5 - 150 - 170 * 1}>
				{@render props.buttonSettings({ anchor: 0.5 })}
			</Container>

			<Container scale={0.8} y={DESKTOP_BASE_SIZE * 0.5 - 150}>
				{@render props.buttonSoundSwitch({ anchor: 0.5 })}
			</Container>

			<Container scale={0.8} y={DESKTOP_BASE_SIZE * 0.5}>
				{@render props.buttonMenuClose({ anchor: 0.5 })}
			</Container>
		</Container>
	</MainContainer>
{/if}
