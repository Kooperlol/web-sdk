<script lang="ts">
	import { Tween } from 'svelte/motion';

	import {
		stateBet,
		stateBetDerived,
		stateUi,
		stateSound,
		stateModal,
		stateConfig,
	} from 'state-shared';
	import {
		numberToCurrencyString,
		bookEventAmountToCurrencyString,
	} from 'utils-shared/amount';

	import { getContext } from '../game/context';

	const context = getContext();

	// ── Derived booleans ────────────────────────────────────────────────────────
	const isIdle = $derived(context.stateXstateDerived.isIdle());
	const hasAutoSpin = $derived(stateBetDerived.hasAutoBetCounter());
	const isBetAvailable = $derived(stateBetDerived.isBetCostAvailable());
	const isTurbo = $derived(stateBet.isTurbo);
	const soundOn = $derived(stateSound.volumeValueMaster > 0);

	// ── Tweened values ───────────────────────────────────────────────────────────
	const balanceTween = new Tween(stateBet.balanceAmount);
	const winTween = new Tween(stateBet.winBookEventAmount);

	$effect(() => { balanceTween.set(stateBet.balanceAmount); });
	$effect(() => { winTween.set(stateBet.winBookEventAmount); });

	// ── Formatted values ─────────────────────────────────────────────────────────
	const balance = $derived(numberToCurrencyString(balanceTween.current));
	const betValue = $derived(numberToCurrencyString(stateBetDerived.betCost()));
	const winValue = $derived(bookEventAmountToCurrencyString(winTween.current));
	const freeSpinLabel = $derived(
		`${stateUi.freeSpinCounterCurrent} / ${stateUi.freeSpinCounterTotal}`,
	);

	// ── Bet progress bar ─────────────────────────────────────────────────────────
	const betProgress = $derived.by(() => {
		const opts = stateConfig.betAmountOptions;
		if (opts.length < 2) return 0;
		const sorted = [...opts].sort((a, b) => a - b);
		const idx = sorted.indexOf(stateBet.betAmount);
		return idx < 0 ? 0 : (idx / (sorted.length - 1)) * 100;
	});

	// ── Visibility flags ──────────────────────────────────────────────────────────
	const showSpin = $derived(isIdle);
	const showStopAutoplay = $derived(hasAutoSpin);
	const showStop = $derived(!isIdle && !hasAutoSpin);
	const showStartAutoplay = $derived(isIdle && !hasAutoSpin);
	const showAutoplayBtn = $derived(isIdle && !hasAutoSpin);
	const showFeaturePanel = $derived(stateUi.freeSpinCounterShow);
	const showWinAmount = $derived(stateBet.winBookEventAmount > 0);

	// ── Actions ──────────────────────────────────────────────────────────────────
	const onSpin = () => {
		context.eventEmitter.broadcast({ type: 'soundPressBet' });
		if (stateBetDerived.activeBetMode()?.type === 'buy') stateBet.activeBetModeKey = 'BASE';
		context.eventEmitter.broadcast({ type: 'bet' });
	};

	const onStop = () => {
		context.eventEmitter.broadcast({ type: 'soundPressBet' });
		if (hasAutoSpin) stateBet.autoSpinsCounter = 0;
		context.eventEmitter.broadcast({ type: 'stopButtonClick' });
	};

	const onBetIncrease = () => {
		if (!isIdle) return;
		context.eventEmitter.broadcast({ type: 'soundPressGeneral' });
		const sorted = [...stateConfig.betAmountOptions].sort((a, b) => a - b);
		const next = sorted.find((o) => o > stateBet.betAmount);
		stateBetDerived.setBetAmount(next ?? sorted[sorted.length - 1]);
	};

	const onBetDecrease = () => {
		if (!isIdle) return;
		context.eventEmitter.broadcast({ type: 'soundPressGeneral' });
		const sorted = [...stateConfig.betAmountOptions].sort((a, b) => a - b);
		const next = [...sorted].reverse().find((o) => o < stateBet.betAmount);
		stateBetDerived.setBetAmount(next ?? sorted[0]);
	};

	const onAutoSpinStart = () => {
		context.eventEmitter.broadcast({ type: 'soundPressGeneral' });
		stateModal.modal = { name: 'autoSpin' };
	};

	const onAutoSpinStop = () => {
		context.eventEmitter.broadcast({ type: 'soundPressGeneral' });
		stateBet.autoSpinsCounter = 0;
	};

	const onMenuToggle = () => {
		context.eventEmitter.broadcast({ type: 'soundPressGeneral' });
		stateUi.menuOpen = !stateUi.menuOpen;
	};

	const onSoundToggle = () => {
		context.eventEmitter.broadcast({ type: 'soundPressGeneral' });
		stateSound.volumeValueMaster = stateSound.volumeValueMaster === 0 ? 50 : 0;
	};

	const onTurboToggle = () => {
		context.eventEmitter.broadcast({ type: 'soundPressGeneral' });
		stateBetDerived.updateIsTurbo(!isTurbo, { persistent: true });
	};

	const onPayTable = () => {
		stateUi.menuOpen = false;
		stateModal.modal = { name: 'payTable' };
	};

	const onGameRules = () => {
		stateUi.menuOpen = false;
		stateModal.modal = { name: 'gameRules' };
	};

	const onSettings = () => {
		stateUi.menuOpen = false;
		stateModal.modal = { name: 'settings' };
	};

	const onBetMenu = () => {
		if (!isIdle) return;
		context.eventEmitter.broadcast({ type: 'soundPressGeneral' });
		stateModal.modal = { name: 'betAmountMenu' };
	};

	const onBuyBonus = () => {
		context.eventEmitter.broadcast({ type: 'soundPressGeneral' });
		stateModal.modal = { name: 'buyBonus' };
	};

	const onCloseMenuBackdrop = () => {
		stateUi.menuOpen = false;
	};
</script>

<!-- backdrop to close menu when clicking outside -->
{#if stateUi.menuOpen}
	<div
		class="MenuBackdrop"
		role="button"
		tabindex="-1"
		onclick={onCloseMenuBackdrop}
		onkeydown={(e) => e.key === 'Escape' && onCloseMenuBackdrop()}
		aria-label="Close menu"
	></div>
{/if}

<div class="UiRibbonUserPanel__container">
	<div id="MainPanel" class="MainPanel">
		<div class="MainPanel__container">

			<!-- ── Feature buy notice (shown during feature spins) ────────────── -->
			{#if stateUi.freeSpinCounterShow}
				<span id="FeatureBuyActiveModifierNotice" class="FeatureBuyActiveModifierNotice">
					<span>FEATURESPINS™ ACTIVATED</span>
				</span>
			{/if}

			<!-- ── Buy Bonus button ───────────────────────────────────────────── -->
			{#if !stateConfig.jurisdiction.disabledBuyFeature}
				<div class="ToggleButton__container--feature-buy">
					<button
						id="FeatureBuyToggle"
						class="ToggleButton--feature-buy is-visible"
						onclick={onBuyBonus}
						tabindex="-1"
					>BUY BONUS</button>
				</div>
			{/if}

			<!-- ── Data panel ─────────────────────────────────────────────────── -->
			<div id="DataPanel" class="DataPanel">

				<!-- Slide-out main menu -->
				<div id="MainMenu" class="MainMenu" class:is-open={stateUi.menuOpen}>
					<ul>
						<li>
							<button
								id="SoundToggle"
								class="MainMenuItem MainMenuItem--sound"
								class:is-active={soundOn}
								onclick={onSoundToggle}
							>
								<span class="MainMenuItem__icon">{soundOn ? '🔊' : '🔇'}</span>
								<span>SOUND</span>
							</button>
						</li>

						<li>
							<button
								class="MainMenuItem MainMenuItem--turbo"
								class:is-active={isTurbo}
								onclick={onTurboToggle}
							>
								<span class="MainMenuItem__icon">{isTurbo ? '⚡' : '💨'}</span>
								<span>TURBO</span>
							</button>
						</li>

						<li>
							<button
								id="GameInfoBtn"
								class="MainMenuItem MainMenuItem--info"
								onclick={onPayTable}
							>
								<span class="MainMenuItem__icon">📋</span>
								<span>PAYTABLE</span>
							</button>
						</li>

						<li>
							<button
								class="MainMenuItem MainMenuItem--rules"
								onclick={onGameRules}
							>
								<span class="MainMenuItem__icon">📖</span>
								<span>RULES</span>
							</button>
						</li>

						<li>
							<button
								class="MainMenuItem MainMenuItem--settings"
								onclick={onSettings}
							>
								<span class="MainMenuItem__icon">⚙️</span>
								<span>SETTINGS</span>
							</button>
						</li>
					</ul>
				</div>

				<!-- Menu toggle button (☰ / ✕) -->
				<div class="ToggleButton__container--main-menu">
					<button
						id="MainMenuToggle"
						class="Button ToggleButton--main-menu"
						class:is-open={stateUi.menuOpen}
						onclick={onMenuToggle}
					>
						{#if stateUi.menuOpen}
							<span class="icon-menu-close">✕</span>
						{:else}
							<span class="icon-menu">☰</span>
						{/if}
					</button>
				</div>

				<span class="divider--vertical"></span>

				<!-- Data items: balance · bet · win -->
				<div class="DataPanel__container">
					<div
						id="BalanceItem"
						class="Balance DataPanelItem is-visible"
						class:is-hidden={showFeaturePanel}
					>
						<span id="BalanceLabel" class="DataPanelItem__label">BALANCE</span>
						<span id="BalanceValue" class="DataPanelItem__value">{balance}</span>
					</div>

					<div
						id="BetAmountStaticItem"
						class="BetAmountStaticItem DataPanelItem is-visible"
						class:is-hidden={showFeaturePanel}
					>
						<div class="ItemWrapper">
							<div class="ItemWrapper__inner">
								<span id="BetAmountStaticLabel" class="DataPanelItem__label">BET</span>
								<span id="BetAmountStaticValue" class="DataPanelItem__value">{betValue}</span>
							</div>
						</div>
					</div>

					{#if showWinAmount}
						<div id="WinAmountItem" class="WinAmount DataPanelItem is-visible">
							<span id="WinAmountLabel" class="DataPanelItem__label">WIN</span>
							<span id="WinAmountValue" class="DataPanelItem__value">{winValue}</span>
						</div>
					{/if}

					{#if showFeaturePanel}
						<div id="FreeRoundsWinItem" class="FreeRoundsWin DataPanelItem is-visible">
							<span class="DataPanelItem__label">TOTAL WIN</span>
							<span id="FreeRoundsWinValue" class="DataPanelItem__value">{winValue}</span>
						</div>
					{/if}
				</div>
			</div>

			<!-- ── Feature panel (free spins) ────────────────────────────────── -->
			{#if showFeaturePanel}
				<div class="FeaturePanel">
					<div id="FeatureTotalWinItem" class="FeatureTotalWin">
						<span class="DataPanelItem__label FeatureTotalWin__label">TOTAL WIN</span>
						<span id="FeatureTotalWinValue" class="FeatureTotalWin__value DataPanelItem__value">{winValue}</span>
					</div>
					<span class="divider--vertical"></span>
					<div id="FeatureCounterItem" class="FeatureCounter">
						<span id="FeatureCounterLabel" class="DataPanelItem__label FeatureCounter__label">FREE SPINS</span>
						<span id="FeatureCounterValue" class="FeatureCounter__value DataPanelItem__value">{freeSpinLabel}</span>
					</div>
				</div>
			{/if}

			<!-- ── Action panel ───────────────────────────────────────────────── -->
			<div
				id="ActionPanel"
				class="ActionPanel"
				class:disabled-slam-stop={isTurbo}
			>
				<!-- Bet amount widget -->
				<div id="BetAmountItem" class="BetAmountWidget is-visible">
					<button class="BetAmountWidget__container" onclick={onBetMenu} disabled={!isIdle}>
						<span id="BetAmountLabel" class="BetAmountWidget__label DataPanelItem__label">BET</span>
						<span id="BetAmountValue" class="BetAmountWidget__value DataPanelItem__value ActiveBetAmountValue">{betValue}</span>
						<span class="BetAmountProgressbar">
							<span
								id="BetAmountIndicatorProgress"
								class="BetAmountProgressbar__inner"
								style="width: {betProgress.toFixed(2)}%;"
							></span>
						</span>
					</button>
				</div>

				<div class="divider--vertical"></div>

				<!-- Game action buttons -->
				<div class="ActionPanel__container--game-actions">
					<div class="BetAmountChangersWidget">
						<button
							id="BetAmountIncrease"
							class="BetAmountChanger--increase-bet"
							onclick={onBetIncrease}
							disabled={!isIdle}
							aria-label="Increase bet"
						>
							<span class="icon-arrow-up">▲</span>
						</button>
						<button
							id="BetAmountDecrease"
							class="BetAmountChanger--decrease-bet"
							onclick={onBetDecrease}
							disabled={!isIdle}
							aria-label="Decrease bet"
						>
							<span class="icon-arrow-down">▼</span>
						</button>
					</div>

					<!-- Spin button -->
					{#if showSpin}
						<button
							id="PlaceBetBtn"
							class="Button CircleButton--place-bet"
							class:is-disabled={!isBetAvailable}
							onclick={onSpin}
							disabled={!isBetAvailable}
							type="button"
							aria-label="Spin"
						>
							<span class="icon-spin">↻</span>
						</button>
					{/if}

					<!-- Stop (during spin, no autospin) -->
					{#if showStop}
						<button
							id="StopBtn"
							class="Button CircleButton--stop-round"
							onclick={onStop}
							type="button"
							aria-label="Stop"
						>
							<span class="icon-stop">◼</span>
						</button>
					{/if}

					<!-- Start autoplay -->
					{#if showStartAutoplay}
						<button
							id="StartAutoplayBtn"
							class="Button CircleButton--start-autoplay"
							onclick={onAutoSpinStart}
							type="button"
							aria-label="Start autoplay"
						>
							<span class="icon-autoplay">⟳</span>
						</button>
					{/if}

					<!-- Stop autoplay (with counter) -->
					{#if showStopAutoplay}
						<button
							id="StopAutoplayBtn"
							class="Button CircleButton--stop-autoplay"
							onclick={onAutoSpinStop}
							type="button"
							aria-label="Stop autoplay"
						>
							<span class="icon-stop">◼</span>
							<span id="AutoplayCounter" class="AutoplayCounter">{stateBet.autoSpinsCounter}</span>
						</button>
					{/if}
				</div>

				<!-- Autoplay menu button -->
				<div class="ActionPanel__container--autoplay">
					{#if showAutoplayBtn}
						<button
							id="AutoplayBtn"
							class="Button ToggleButton--autoplay-menu"
							onclick={onAutoSpinStart}
							aria-label="Autoplay"
						>
							<span class="icon-autoplay2">⟳</span>
						</button>
					{/if}
				</div>

				<div class="ToggleButton__container--feature-promotion"></div>
			</div>

			<div id="FeedbackMsg" class="FeedbackMsg"></div>
		</div>
	</div>
</div>

<style>
	/* ── Backdrop ──────────────────────────────────────────────────────────────── */
	.MenuBackdrop {
		position: fixed;
		inset: 0;
		z-index: 99;
		background: rgba(0, 0, 0, 0.35);
	}

	/* ── Outer container — centered floating pill ──────────────────────────────── */
	.UiRibbonUserPanel__container {
		position: fixed;
		bottom: 14px;
		left: 50%;
		transform: translateX(-50%);
		z-index: 100;
		font-family: 'proxima-nova', sans-serif;
		-webkit-user-select: none;
		user-select: none;
		width: max-content;
		min-width: 480px;
		max-width: calc(100vw - 24px);
	}

	.MainPanel {
		width: 100%;
	}

	.MainPanel__container {
		display: flex;
		flex-direction: column;
		position: relative;
		border-radius: 14px;
		overflow: visible;
		background: rgba(0, 0, 0, 0.5);
		backdrop-filter: blur(12px);
		-webkit-backdrop-filter: blur(12px);
		border: 1px solid rgba(255, 255, 255, 0.08);
		box-shadow: 0 8px 32px rgba(0, 0, 0, 0.45);
	}

	/* ── Feature buy notice ────────────────────────────────────────────────────── */
	.FeatureBuyActiveModifierNotice {
		display: flex;
		justify-content: center;
		align-items: center;
		background: linear-gradient(90deg, #b8860b, #ffd700, #b8860b);
		color: #000;
		font-size: 10px;
		font-weight: 800;
		letter-spacing: 0.12em;
		padding: 3px 16px;
		border-radius: 14px 14px 0 0;
		text-transform: uppercase;
	}

	/* ── Buy Bonus button ──────────────────────────────────────────────────────── */
	.ToggleButton__container--feature-buy {
		position: absolute;
		top: -34px;
		right: 10px;
		z-index: 10;
	}

	.ToggleButton--feature-buy {
		background: linear-gradient(135deg, #b8860b, #ffd700);
		color: #000;
		border: none;
		border-radius: 6px 6px 0 0;
		padding: 5px 12px;
		font-size: 10px;
		font-weight: 800;
		letter-spacing: 0.1em;
		cursor: pointer;
		text-transform: uppercase;
		transition: opacity 0.15s;
	}

	.ToggleButton--feature-buy:hover {
		opacity: 0.85;
	}

	/* ── Data panel ─────────────────────────────────────────────────────────────── */
	.DataPanel {
		display: flex;
		align-items: center;
		padding: 0 10px;
		height: 36px;
		position: relative;
		border-bottom: 1px solid rgba(255, 255, 255, 0.07);
		border-radius: 14px 14px 0 0;
		gap: 0;
	}

	/* ── Main menu — pops up above the toggle button ────────────────────────────── */
	.MainMenu {
		position: absolute;
		bottom: calc(100% + 8px);
		left: 0;
		width: 190px;
		background: rgba(10, 10, 22, 0.92);
		backdrop-filter: blur(16px);
		-webkit-backdrop-filter: blur(16px);
		border: 1px solid rgba(255, 255, 255, 0.1);
		border-radius: 10px;
		transform: translateY(6px) scale(0.97);
		transform-origin: bottom left;
		opacity: 0;
		pointer-events: none;
		transition:
			transform 0.2s cubic-bezier(0.4, 0, 0.2, 1),
			opacity 0.18s;
		z-index: 200;
		overflow: hidden;
	}

	.MainMenu.is-open {
		transform: translateY(0) scale(1);
		opacity: 1;
		pointer-events: all;
	}

	.MainMenu ul {
		list-style: none;
		margin: 0;
		padding: 4px 0;
	}

	.MainMenu li {
		border-bottom: 1px solid rgba(255, 255, 255, 0.05);
	}

	.MainMenu li:last-child {
		border-bottom: none;
	}

	.MainMenuItem {
		display: flex;
		align-items: center;
		gap: 10px;
		width: 100%;
		padding: 9px 14px;
		background: transparent;
		border: none;
		color: rgba(255, 255, 255, 0.75);
		font-family: 'proxima-nova', sans-serif;
		font-size: 11px;
		font-weight: 700;
		letter-spacing: 0.07em;
		text-transform: uppercase;
		cursor: pointer;
		transition: background 0.15s, color 0.15s;
		text-align: left;
	}

	.MainMenuItem:hover {
		background: rgba(255, 255, 255, 0.07);
		color: #fff;
	}

	.MainMenuItem.is-active {
		color: #ffd700;
	}

	.MainMenuItem__icon {
		font-size: 14px;
		width: 18px;
		text-align: center;
		flex-shrink: 0;
	}

	/* ── Menu toggle button ─────────────────────────────────────────────────────── */
	.ToggleButton__container--main-menu {
		flex-shrink: 0;
		margin-right: 6px;
	}

	.ToggleButton--main-menu {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 28px;
		height: 28px;
		background: rgba(255, 255, 255, 0.07);
		border: 1px solid rgba(255, 255, 255, 0.1);
		border-radius: 6px;
		color: #fff;
		font-size: 15px;
		cursor: pointer;
		transition: background 0.15s, border-color 0.15s;
		padding: 0;
		line-height: 1;
	}

	.ToggleButton--main-menu:hover,
	.ToggleButton--main-menu.is-open {
		background: rgba(255, 255, 255, 0.15);
		border-color: rgba(255, 255, 255, 0.28);
	}

	.icon-menu,
	.icon-menu-close {
		display: block;
		line-height: 1;
		transition: transform 0.18s;
	}

	.ToggleButton--main-menu.is-open .icon-menu-close {
		transform: rotate(90deg);
	}

	/* ── Vertical divider ───────────────────────────────────────────────────────── */
	.divider--vertical {
		display: block;
		width: 1px;
		align-self: stretch;
		background: rgba(255, 255, 255, 0.1);
		margin: 5px 8px;
		flex-shrink: 0;
	}

	/* ── DataPanel items ────────────────────────────────────────────────────────── */
	.DataPanel__container {
		display: flex;
		align-items: center;
		gap: 16px;
		flex: 1;
		justify-content: center;
	}

	.DataPanelItem {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0;
		min-width: 56px;
	}

	.DataPanelItem.is-hidden {
		display: none;
	}

	.DataPanelItem__label {
		font-size: 8px;
		font-weight: 700;
		color: rgba(255, 255, 255, 0.45);
		letter-spacing: 0.1em;
		text-transform: uppercase;
		line-height: 1.2;
	}

	.DataPanelItem__value {
		font-size: 13px;
		font-weight: 700;
		color: #fff;
		letter-spacing: 0.01em;
		line-height: 1.2;
	}

	.WinAmount .DataPanelItem__value {
		color: #ffd700;
	}

	/* ── Feature panel (free spins row) ─────────────────────────────────────────── */
	.FeaturePanel {
		display: flex;
		align-items: center;
		justify-content: center;
		background: rgba(180, 130, 0, 0.12);
		border-bottom: 1px solid rgba(255, 215, 0, 0.2);
		padding: 3px 16px;
		height: 28px;
	}

	.FeatureTotalWin,
	.FeatureCounter {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0;
		flex: 1;
	}

	.FeatureTotalWin__label,
	.FeatureCounter__label {
		font-size: 8px;
		font-weight: 700;
		color: rgba(255, 215, 0, 0.65);
		letter-spacing: 0.1em;
	}

	.FeatureTotalWin__value,
	.FeatureCounter__value {
		font-size: 13px;
		font-weight: 800;
		color: #ffd700;
		line-height: 1.2;
	}

	/* ── Action panel ───────────────────────────────────────────────────────────── */
	.ActionPanel {
		display: flex;
		align-items: center;
		padding: 8px 10px;
		gap: 0;
		border-radius: 0 0 14px 14px;
	}

	/* ── Bet amount widget ──────────────────────────────────────────────────────── */
	.BetAmountWidget {
		flex-shrink: 0;
		min-width: 72px;
	}

	.BetAmountWidget__container {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 1px;
		cursor: pointer;
		background: transparent;
		border: none;
		padding: 0;
		font-family: 'proxima-nova', sans-serif;
	}

	.BetAmountWidget__container:disabled {
		cursor: default;
		opacity: 0.6;
	}

	.BetAmountWidget__label {
		font-size: 8px;
		font-weight: 700;
		color: rgba(255, 255, 255, 0.45);
		letter-spacing: 0.1em;
		text-transform: uppercase;
	}

	.BetAmountWidget__value {
		font-size: 13px;
		font-weight: 800;
		color: #fff;
		letter-spacing: 0.01em;
	}

	.BetAmountWidget__container:not(:disabled):hover .BetAmountWidget__value,
	.BetAmountWidget__container:not(:disabled):hover .BetAmountWidget__label {
		color: #ffd700;
	}

	.BetAmountProgressbar {
		display: block;
		width: 64px;
		height: 2px;
		background: rgba(255, 255, 255, 0.1);
		border-radius: 2px;
		margin-top: 3px;
		overflow: hidden;
	}

	.BetAmountProgressbar__inner {
		display: block;
		height: 100%;
		background: linear-gradient(90deg, #5555bb, #ffd700);
		border-radius: 2px;
		transition: width 0.2s;
	}

	/* ── Game actions container ─────────────────────────────────────────────────── */
	.ActionPanel__container--game-actions {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 8px;
		flex: 1;
	}

	/* ── Bet changers ───────────────────────────────────────────────────────────── */
	.BetAmountChangersWidget {
		display: flex;
		flex-direction: column;
		gap: 2px;
	}

	.BetAmountChanger--increase-bet,
	.BetAmountChanger--decrease-bet {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 24px;
		height: 20px;
		background: rgba(255, 255, 255, 0.06);
		border: 1px solid rgba(255, 255, 255, 0.1);
		border-radius: 4px;
		color: rgba(255, 255, 255, 0.75);
		font-size: 9px;
		cursor: pointer;
		transition: background 0.12s;
		padding: 0;
	}

	.BetAmountChanger--increase-bet:hover:not(:disabled),
	.BetAmountChanger--decrease-bet:hover:not(:disabled) {
		background: rgba(255, 255, 255, 0.14);
		color: #fff;
	}

	.BetAmountChanger--increase-bet:disabled,
	.BetAmountChanger--decrease-bet:disabled {
		opacity: 0.25;
		cursor: not-allowed;
	}

	/* ── Circle action buttons ──────────────────────────────────────────────────── */
	.Button {
		border: none;
		cursor: pointer;
		display: flex;
		align-items: center;
		justify-content: center;
		transition: transform 0.1s, opacity 0.15s;
		padding: 0;
		position: relative;
	}

	.Button:active {
		transform: scale(0.91);
	}

	/* Spin button — large white circle */
	.CircleButton--place-bet {
		width: 52px;
		height: 52px;
		border-radius: 50%;
		background: #fff;
		color: #111;
		font-size: 22px;
		box-shadow: 0 0 0 3px rgba(255, 255, 255, 0.18), 0 4px 14px rgba(0, 0, 0, 0.5);
	}

	.CircleButton--place-bet.is-disabled,
	.CircleButton--place-bet:disabled {
		background: #444;
		color: #777;
		cursor: not-allowed;
		box-shadow: none;
	}

	.CircleButton--place-bet:not(:disabled):hover {
		box-shadow: 0 0 0 4px rgba(255, 255, 255, 0.32), 0 4px 18px rgba(0, 0, 0, 0.6);
	}

	/* Stop round button */
	.CircleButton--stop-round {
		width: 52px;
		height: 52px;
		border-radius: 50%;
		background: rgba(200, 50, 50, 0.85);
		color: #fff;
		font-size: 18px;
		box-shadow: 0 0 0 3px rgba(200, 50, 50, 0.25), 0 4px 14px rgba(0, 0, 0, 0.5);
	}

	/* Autoplay start (smaller circle) */
	.CircleButton--start-autoplay {
		width: 38px;
		height: 38px;
		border-radius: 50%;
		background: rgba(255, 255, 255, 0.07);
		border: 1px solid rgba(255, 255, 255, 0.18);
		color: rgba(255, 255, 255, 0.75);
		font-size: 16px;
	}

	.CircleButton--start-autoplay:hover {
		background: rgba(255, 255, 255, 0.14);
		border-color: rgba(255, 255, 255, 0.35);
		color: #fff;
	}

	/* Stop autoplay button */
	.CircleButton--stop-autoplay {
		width: 38px;
		height: 38px;
		border-radius: 50%;
		background: rgba(255, 215, 0, 0.12);
		border: 1px solid rgba(255, 215, 0, 0.45);
		color: #ffd700;
		font-size: 14px;
		flex-direction: column;
		gap: 0;
	}

	.AutoplayCounter {
		font-size: 8px;
		font-weight: 800;
		color: #ffd700;
		line-height: 1;
	}

	/* ── Autoplay panel button ──────────────────────────────────────────────────── */
	.ActionPanel__container--autoplay {
		flex-shrink: 0;
		min-width: 42px;
		display: flex;
		justify-content: flex-end;
	}

	.ToggleButton--autoplay-menu {
		width: 32px;
		height: 32px;
		border-radius: 6px;
		background: rgba(255, 255, 255, 0.05);
		border: 1px solid rgba(255, 255, 255, 0.1);
		color: rgba(255, 255, 255, 0.55);
		font-size: 16px;
	}

	.ToggleButton--autoplay-menu:hover {
		background: rgba(255, 255, 255, 0.12);
		color: #fff;
	}

	.ToggleButton__container--feature-promotion {
		min-width: 0;
	}

	/* ── Feedback message ───────────────────────────────────────────────────────── */
	.FeedbackMsg {
		display: none;
		text-align: center;
		font-size: 10px;
		color: #ffd700;
		padding: 2px 0;
		border-radius: 0 0 14px 14px;
	}

	.FeedbackMsg:not(:empty) {
		display: block;
	}
</style>
