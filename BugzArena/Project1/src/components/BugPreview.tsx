import React, { useRef, useEffect } from 'react';

interface BugPreviewProps {
  bugData: {
    name: string;
    color: string;
    traits: {
      speed: number;
      strength: number;
      defense: number;
      intelligence: number;
    };
  };
}

const BugPreview: React.FC<BugPreviewProps> = ({ bugData }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw bug based on traits
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    
    // Body size based on defense
    const bodySize = 20 + (bugData.traits.defense / 100) * 20;
    
    // Draw main body
    ctx.fillStyle = bugData.color;
    ctx.beginPath();
    ctx.ellipse(centerX, centerY, bodySize, bodySize * 0.7, 0, 0, 2 * Math.PI);
    ctx.fill();

    // Draw head
    ctx.beginPath();
    ctx.arc(centerX, centerY - bodySize * 0.8, bodySize * 0.6, 0, 2 * Math.PI);
    ctx.fill();

    // Draw legs (more legs for higher speed)
    const legCount = Math.floor(3 + (bugData.traits.speed / 100) * 3);
    ctx.strokeStyle = bugData.color;
    ctx.lineWidth = 3;
    
    for (let i = 0; i < legCount; i++) {
      const angle = (i / legCount) * Math.PI * 2;
      const legLength = 15 + (bugData.traits.speed / 100) * 10;
      
      // Left legs
      ctx.beginPath();
      ctx.moveTo(centerX - bodySize * 0.8, centerY + Math.sin(angle) * bodySize * 0.3);
      ctx.lineTo(
        centerX - bodySize * 0.8 - legLength, 
        centerY + Math.sin(angle) * bodySize * 0.3 + legLength * 0.5
      );
      ctx.stroke();

      // Right legs
      ctx.beginPath();
      ctx.moveTo(centerX + bodySize * 0.8, centerY + Math.sin(angle) * bodySize * 0.3);
      ctx.lineTo(
        centerX + bodySize * 0.8 + legLength, 
        centerY + Math.sin(angle) * bodySize * 0.3 + legLength * 0.5
      );
      ctx.stroke();
    }

    // Draw eyes
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(centerX - bodySize * 0.3, centerY - bodySize * 0.8, 4, 0, 2 * Math.PI);
    ctx.arc(centerX + bodySize * 0.3, centerY - bodySize * 0.8, 4, 0, 2 * Math.PI);
    ctx.fill();

    // Draw pupils
    ctx.fillStyle = '#000000';
    ctx.beginPath();
    ctx.arc(centerX - bodySize * 0.3, centerY - bodySize * 0.8, 2, 0, 2 * Math.PI);
    ctx.arc(centerX + bodySize * 0.3, centerY - bodySize * 0.8, 2, 0, 2 * Math.PI);
    ctx.fill();

    // Draw strength indicators (spikes/armor)
    if (bugData.traits.strength > 70) {
      ctx.fillStyle = '#ff0080';
      for (let i = 0; i < 6; i++) {
        const angle = (i / 6) * Math.PI * 2;
        const spikeX = centerX + Math.cos(angle) * bodySize * 1.2;
        const spikeY = centerY + Math.sin(angle) * bodySize * 1.2;
        
        ctx.beginPath();
        ctx.moveTo(spikeX, spikeY);
        ctx.lineTo(
          spikeX + Math.cos(angle) * 8,
          spikeY + Math.sin(angle) * 8
        );
        ctx.lineTo(
          spikeX + Math.cos(angle + 0.3) * 6,
          spikeY + Math.sin(angle + 0.3) * 6
        );
        ctx.closePath();
        ctx.fill();
      }
    }

    // Draw intelligence indicator (antennae)
    if (bugData.traits.intelligence > 50) {
      ctx.strokeStyle = '#8800ff';
      ctx.lineWidth = 2;
      
      // Left antenna
      ctx.beginPath();
      ctx.moveTo(centerX - bodySize * 0.2, centerY - bodySize * 1.2);
      ctx.quadraticCurveTo(
        centerX - bodySize * 0.8, 
        centerY - bodySize * 1.8,
        centerX - bodySize * 0.6, 
        centerY - bodySize * 2
      );
      ctx.stroke();

      // Right antenna
      ctx.beginPath();
      ctx.moveTo(centerX + bodySize * 0.2, centerY - bodySize * 1.2);
      ctx.quadraticCurveTo(
        centerX + bodySize * 0.8, 
        centerY - bodySize * 1.8,
        centerX + bodySize * 0.6, 
        centerY - bodySize * 2
      );
      ctx.stroke();

      // Antenna tips
      ctx.fillStyle = '#8800ff';
      ctx.beginPath();
      ctx.arc(centerX - bodySize * 0.6, centerY - bodySize * 2, 3, 0, 2 * Math.PI);
      ctx.arc(centerX + bodySize * 0.6, centerY - bodySize * 2, 3, 0, 2 * Math.PI);
      ctx.fill();
    }

  }, [bugData]);

  return (
    <div className="bg-dark-700 rounded-lg p-4 flex flex-col items-center">
      <canvas
        ref={canvasRef}
        width={300}
        height={250}
        className="border border-gray-600 rounded-lg mb-4"
      />
      <div className="text-center">
        <h3 className="text-lg font-bold text-white mb-2">
          {bugData.name || 'Unnamed Bug'}
        </h3>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="text-neon-yellow">Speed: {bugData.traits.speed}</div>
          <div className="text-neon-pink">Strength: {bugData.traits.strength}</div>
          <div className="text-neon-blue">Defense: {bugData.traits.defense}</div>
          <div className="text-neon-purple">Intelligence: {bugData.traits.intelligence}</div>
        </div>
      </div>
    </div>
  );
};

export default BugPreview;