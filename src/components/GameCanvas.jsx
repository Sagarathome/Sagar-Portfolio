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
import AboutSection from './AboutSection';
import ExperienceSection from './ExperienceSection';
import SkillsSection from './SkillsSection';
import ContactSection from './ContactSection';
import ProjectsSection from './ProjectsSection';

const { width: CANVAS_W, height: CANVAS_H } = getGameCanvasSize();

function GameCanvas() {
    const canvasRef = useRef(null);
    const modalOpenRef = useRef(false);
    const [buildingModal, setBuildingModal] = useState(null);

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
        const collision = buildDefaultCollision(canvas.width, canvas.height);

        const input = { keys: {} };
        const arrowCodes = new Set([
            'ArrowUp',
            'ArrowDown',
            'ArrowLeft',
            'ArrowRight',
        ]);
        const clearMovementKeys = () => {
            for (const code of arrowCodes) input.keys[code] = false;
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
            if (arrowCodes.has(e.code)) e.preventDefault();
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
            if (arrowCodes.has(e.code)) e.preventDefault();
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
            player.update(input, canvas, collision, deltaTime);
            player.draw(ctx);

            const entrance = getEntranceAtPlayer(player, canvas.width, canvas.height);
            if (entrance && !modalOpenRef.current) {
                ctx.font = 'bold 16px sans-serif';
                ctx.textAlign = 'center';
                const msg = `Press Enter — ${entrance.title}`;
                const padding = 12;
                const textW = ctx.measureText(msg).width;
                const boxX = canvas.width / 2 - textW / 2 - padding;
                const boxY = canvas.height - 100;
                const boxW = textW + padding * 2;
                const boxH = 28;
                ctx.fillStyle = 'rgba(0,0,0,0.75)';
                ctx.beginPath();
                ctx.roundRect(boxX, boxY, boxW, boxH, 6);
                ctx.fill();
                ctx.strokeStyle = 'rgba(255,255,255,0.5)';
                ctx.lineWidth = 1;
                ctx.stroke();
                ctx.fillStyle = '#fff';
                ctx.fillText(msg, canvas.width / 2, boxY + boxH / 2 + 5);
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
            {buildingModal && (
                <div
                    className="building-modal-backdrop"
                    role="presentation"
                    onClick={closeModal}
                >
                    <div
                        className="building-modal"
                        role="dialog"
                        aria-modal="true"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="building-modal-content">
                            {buildingModal.id === 'about' && <AboutSection />}
                            {buildingModal.id === 'experience' && <ExperienceSection />}
                            {buildingModal.id === 'skills' && <SkillsSection />}
                            {buildingModal.id === 'contact' && <ContactSection />}
                            {buildingModal.id === 'projects' && <ProjectsSection />}
                            {!['about', 'experience', 'skills', 'contact', 'projects'].includes(buildingModal.id) && (
                                <>
                                    <h2 className="building-modal-title">{buildingModal.title}</h2>
                                    <p className="building-modal-body">{buildingModal.body}</p>
                                </>
                            )}
                        </div>
                        <button type="button" className="building-modal-close" onClick={closeModal}>
                            Close
                        </button>
                        <p className="building-modal-hint">Press Escape to close</p>
                    </div>
                </div>
            )}
        </div>
    )
}

export default GameCanvas
