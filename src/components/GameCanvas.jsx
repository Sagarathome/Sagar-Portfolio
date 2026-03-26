import React, { useEffect, useRef, useState } from 'react';
import MapImage from '../assets/cityMap2.png';
import HeroImage from '../assets/hero-sheet.png';
import Player from '../game/Player';
import { getEntranceAtPlayer } from '../game/buildingEntrances';
import {
    buildDefaultCollision,
    drawBackgroundInGrid,
    drawCollisionDebug,
    drawGridOverlay,
    getGameCanvasSize,
} from '../game/collision';
import Modal from './modal/Modal';
import Dialog from './dialog/Dialog';
import IntroMessage from './intro/IntroMessage';
import Instruction from './instructions/Instruction';

const { width: CANVAS_W, height: CANVAS_H } = getGameCanvasSize();

function GameCanvas() {
    const canvasRef = useRef(null);
    const modalOpenRef = useRef(false);
    const playerDialogRef = useRef(null);
    const introMessageRef = useRef(null);
    const instructionRef = useRef(null);
    const initialPlayerPositionRef = useRef(null);
    const hasLeftInitialPositionRef = useRef(false);
    const dialogMessageRef = useRef('');
    const showIntroMessageRef = useRef(true);
    const showInstructionRef = useRef(false);
    const [buildingModal, setBuildingModal] = useState(null);
    const [dialogMessage, setDialogMessage] = useState('');
    const [showIntroMessage, setShowIntroMessage] = useState(true);
    const [showInstruction, setShowInstruction] = useState(false);

    useEffect(() => {
        showIntroMessageRef.current = showIntroMessage;
    }, [showIntroMessage]);

    useEffect(() => {
        showInstructionRef.current = showInstruction;
    }, [showInstruction]);

    useEffect(() => {
        document.body.classList.toggle('modal-open', Boolean(buildingModal));
        return () => {
            document.body.classList.remove('modal-open');
        };
    }, [buildingModal]);


    const closeModal = () => {
        modalOpenRef.current = false;
        setBuildingModal(null);
    };

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');

        canvas.width = CANVAS_W;
        canvas.height = CANVAS_H;

        const backGroundImage = new Image();
        backGroundImage.src = MapImage;

        const playerImage = new Image();
        playerImage.src = HeroImage;

        const drawGroundFallBack = () => {
            const g = ctx.createLinearGradient(0, 0, canvas.width, canvas.height)
            g.addColorStop(0, '#1e1033')
            g.addColorStop(0.5, '#2d1b4e')
            g.addColorStop(1, '#120a1f')
            ctx.fillStyle = g
            ctx.fillRect(0, 0, canvas.width, canvas.height)
        }

        const player = new Player(playerImage, canvas.width / 2 - 32, canvas.height / 2 - 32);
        initialPlayerPositionRef.current = { x: player.x, y: player.y };
        hasLeftInitialPositionRef.current = false;
        
        const collision = buildDefaultCollision(canvas.width, canvas.height);

        const input = { keys: {} };
        const arrowCodes = new Set([
            'ArrowUp',
            'ArrowDown',
            'ArrowLeft',
            'ArrowRight',
        ]);
        const movementCodes = new Set([...arrowCodes, 'Space']);
        const clearMovementKeys = () => {
            for (const code of movementCodes) input.keys[code] = false;
        };
        const onKeyDown = (e) => {
            if (modalOpenRef.current) {
                if (e.code === 'Escape' && !e.repeat) {
                    e.preventDefault();
                    modalOpenRef.current = false;
                    setBuildingModal(null);
                }
                return;
            }
            if (movementCodes.has(e.code)) e.preventDefault();
            input.keys[e.code] = true;
            if (e.code === 'Enter' && !e.repeat) {
                const entrance = getEntranceAtPlayer(player, canvas.width, canvas.height);
                if (entrance) {
                    e.preventDefault();
                    modalOpenRef.current = true;
                    setBuildingModal({
                        id: entrance.id,
                        title: entrance.title,
                        body: entrance.body,
                    });
                    clearMovementKeys();
                }
            }
        };
        const onKeyUp = (e) => {
            if (modalOpenRef.current) return;
            if (movementCodes.has(e.code)) e.preventDefault();
            input.keys[e.code] = false;
        };
        window.addEventListener('keydown', onKeyDown);
        window.addEventListener('keyup', onKeyUp);

        let animationId = null;
        let lastTime = performance.now();
        const render = (currentTime) => {
            const deltaTime = Math.min((currentTime - lastTime) / 1000, 0.1);
            lastTime = currentTime;

            ctx.clearRect(0, 0, canvas.width, canvas.height);

            if (backGroundImage.complete && backGroundImage.naturalWidth > 0) {
                drawBackgroundInGrid(ctx, canvas.width, canvas.height, backGroundImage, collision.cellSize);
            } else {
                drawGroundFallBack();
            }

            drawGridOverlay(ctx, canvas.width, canvas.height, collision.cellSize);
            drawCollisionDebug(ctx, collision);

            if (modalOpenRef.current) clearMovementKeys();
            const prevX = player.x;
            const prevY = player.y;
            player.update(input, canvas, collision, deltaTime);
            player.draw(ctx);
            const initialPosition = initialPlayerPositionRef.current;
            if (!hasLeftInitialPositionRef.current && initialPosition) {
                const hasMovedFromStart = player.x !== initialPosition.x || player.y !== initialPosition.y;
                if (hasMovedFromStart) {
                    hasLeftInitialPositionRef.current = true;
                    if (showInstructionRef.current) setShowInstruction(false);
                }
            }
            const entrance = getEntranceAtPlayer(player, canvas.width, canvas.height);
            const nextDialogMessage = entrance && !modalOpenRef.current
                ? `Press Enter - ${entrance.title}`
                : '';
            if (nextDialogMessage !== dialogMessageRef.current) {
                dialogMessageRef.current = nextDialogMessage;
                setDialogMessage(nextDialogMessage);
            }

            if (nextDialogMessage && playerDialogRef.current) {
                const rect = canvas.getBoundingClientRect();
                const scaleX = rect.width / canvas.width;
                const scaleY = rect.height / canvas.height;
                const playerCenterX = player.x + player.width / 2;
                const playerTopY = player.y - 10;
                const screenX = rect.left + playerCenterX * scaleX;
                const screenY = rect.top + playerTopY * scaleY;

                playerDialogRef.current.style.left = `${screenX}px`;
                playerDialogRef.current.style.top = `${screenY}px   `;
            }
            if (showIntroMessageRef.current && introMessageRef.current) {
                const rect = canvas.getBoundingClientRect();
                const scaleX = rect.width / canvas.width;
                const scaleY = rect.height / canvas.height;
                const playerCenterX = player.x + player.width / 2 - 60;
                const playerTopY = player.y - 1;
                const screenX = rect.left + playerCenterX * scaleX;
                const screenY = rect.top + playerTopY * scaleY;

                introMessageRef.current.style.left = `${screenX}px`;
                introMessageRef.current.style.top = `${screenY}px`;
            }
            if (showInstructionRef.current && instructionRef.current) {
                const rect = canvas.getBoundingClientRect();
                const scaleX = rect.width / canvas.width;
                const scaleY = rect.height / canvas.height;
                const playerCenterX = player.x + player.width / 2;
                const playerTopY = player.y + 90;
                const screenX = rect.left + playerCenterX * scaleX;
                const screenY = rect.top + playerTopY * scaleY;

                instructionRef.current.style.left = `${screenX}px`;
                instructionRef.current.style.top = `${screenY}px`;
            }

            animationId = requestAnimationFrame((t) => render(t));
        };

        render(performance.now());

        return () => {
            cancelAnimationFrame(animationId);
            window.removeEventListener('keydown', onKeyDown);
            window.removeEventListener('keyup', onKeyUp);
        }

    }, []);

    const handleIntroComplete = () => {
        setShowIntroMessage(false);
        setShowInstruction(!hasLeftInitialPositionRef.current);
    };

    return (
        <div className="canvas-wrap">
            <canvas
                id="gameCanvas"
                className="game-canvas"
                ref={canvasRef}
                width={CANVAS_W}
                height={CANVAS_H}
                role="img"
                aria-label="City map game canvas"
            />
            <Modal buildingModal={buildingModal} onClose={closeModal} />
            <Dialog ref={playerDialogRef} message={dialogMessage} />
            <IntroMessage ref={introMessageRef} visible={showIntroMessage} onComplete={handleIntroComplete} />
            <Instruction ref={instructionRef} visible={showInstruction} />
        </div>
    )
}

export default GameCanvas
