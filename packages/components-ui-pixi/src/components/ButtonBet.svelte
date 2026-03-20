<script lang="ts">
	import { Container, Text } from 'pixi-svelte';
	import { Button, type ButtonProps } from 'components-pixi';
	import { OnHotkey } from 'components-shared';
	import { stateBetDerived } from 'state-shared';

	import UiSprite from './UiSprite.svelte';
	import ButtonBetProvider from './ButtonBetProvider.svelte';
	import { UI_BASE_FONT_SIZE, UI_BASE_SIZE } from '../constants';

	const props: Partial<Omit<ButtonProps, 'children'>> = $props();
	const disabled = $derived(!stateBetDerived.isBetCostAvailable());
	const sizes = { width: UI_BASE_SIZE, height: UI_BASE_SIZE };
</script>

<ButtonBetProvider>
	{#snippet children({ key, onpress })}
		<OnHotkey hotkey="Space" {disabled} {onpress} />
		<Button {...props} {sizes} {onpress} {disabled}>
			{#snippet children({ center, hovered })}
				<Container {...center}>
				<UiSprite
					key="bet"
					width={sizes.width}
					height={sizes.height}
					anchor={0.5}
					borderRadius={sizes.width / 2}
					backgroundColor={0xffffff}
					{...disabled || ['spin_disabled', 'stop_disabled'].includes(key)
						? {
								backgroundColor: 0xcccccc,
							}
						: {}}
				/>
				<Text
					anchor={0.5}
					text={['spin_default', 'spin_disabled'].includes(key) ? '↻' : '◼'}
					style={{
						align: 'center',
						fontFamily: 'proxima-nova',
						fontWeight: '700',
						fontSize: UI_BASE_FONT_SIZE * 1.6,
						fill: disabled || ['spin_disabled', 'stop_disabled'].includes(key)
							? 0x888888
							: 0x111111,
					}}
				/>
				</Container>
			{/snippet}
		</Button>
	{/snippet}
</ButtonBetProvider>
