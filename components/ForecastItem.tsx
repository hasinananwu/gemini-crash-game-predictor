
import React, { useState, useEffect } from 'react';
import type { Forecast } from '../types';
import { useTranslations } from '../hooks/useTranslations';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { MULTIPLIER_COLORS, getMultiplierCategory } from '../constants';

interface ForecastItemProps {
    item: Forecast;
    isEditing: boolean;
    onStartEdit: (round: number) => void;
    onCancelEdit: () => void;
    onApplyEdit: (round: number, updatedValues: { startTime: Date, crashTime: Date, multiplier: number }) => void;
}

const formatTimeForInput = (date: Date): string => date.toTimeString().split(' ')[0];

const parseTimeFromInput = (timeString: string, originalDate: Date): Date => {
    const [hours, minutes, seconds] = timeString.split(':').map(Number);
    const newDate = new Date(originalDate);
    newDate.setHours(hours, minutes, seconds || 0, 0);
    return newDate;
};

const MultiplierDisplay = ({ multiplier }: { multiplier: number }) => {
    const category = getMultiplierCategory(multiplier);
    const { text, bg, ball } = MULTIPLIER_COLORS[category];

    return (
        <span className={`px-3 py-1 rounded-full font-mono font-bold text-sm flex items-center gap-2 ${text} ${bg}`}>
            <span>{ball}</span>
            <span>{multiplier.toFixed(2)}x</span>
        </span>
    );
};


export const ForecastItem = ({ item, isEditing, onStartEdit, onCancelEdit, onApplyEdit }: ForecastItemProps) => {
    const { t } = useTranslations();
    
    const [startTimeInput, setStartTimeInput] = useState('');
    const [crashTimeInput, setCrashTimeInput] = useState('');
    const [multiplierInput, setMultiplierInput] = useState('');

    useEffect(() => {
        if (item) {
            setStartTimeInput(formatTimeForInput(item.startTime));
            setCrashTimeInput(formatTimeForInput(item.crashTime));
            setMultiplierInput(item.multiplier.toFixed(2));
        }
    }, [item]);

    const handleSave = () => {
        const newStartTime = parseTimeFromInput(startTimeInput, item.startTime);
        const newCrashTime = parseTimeFromInput(crashTimeInput, item.crashTime);
        const newMultiplier = parseFloat(multiplierInput);
        
        if (!isNaN(newMultiplier) && newMultiplier >= 1.0) {
            onApplyEdit(item.round, {
                startTime: newStartTime,
                crashTime: newCrashTime,
                multiplier: newMultiplier,
            });
        } else {
            // Basic error handling - could be improved with a visual error message
            console.error("Invalid multiplier value");
        }
    };

    if (isEditing) {
        return (
            <div className="bg-cyan-900/30 p-3 rounded-lg border border-cyan-700 space-y-3">
                <div className="flex items-center gap-4">
                    <span className="text-gray-500 font-bold text-sm w-8">R{item.round}</span>
                    <div className="grid grid-cols-3 gap-2 flex-grow">
                         <div>
                            <label className="text-xs text-gray-400">{t('feedback.crashTimeLabel')}</label>
                            <Input type="time" step="1" value={startTimeInput} onChange={e => setStartTimeInput(e.target.value)} />
                         </div>
                         <div>
                            <label className="text-xs text-gray-400">{t('feedback.crashTimeLabel')}</label>
                            <Input type="time" step="1" value={crashTimeInput} onChange={e => setCrashTimeInput(e.target.value)} />
                         </div>
                         <div>
                            <label className="text-xs text-gray-400">{t('feedback.multiplierLabel')}</label>
                            <Input type="number" step="0.01" min="1.00" value={multiplierInput} onChange={e => setMultiplierInput(e.target.value)} />
                         </div>
                    </div>
                </div>
                <div className="flex justify-end gap-2">
                    <Button onClick={onCancelEdit} variant="secondary" size="sm">{t('forecast.cancel')}</Button>
                    <Button onClick={handleSave} size="sm">{t('forecast.save')}</Button>
                </div>
            </div>
        );
    }
    
    return (
        <div className="flex justify-between items-center bg-gray-800 p-3 rounded-lg hover:bg-gray-700/50 transition-colors">
           <div className="flex items-center space-x-4">
               <span className="text-gray-500 font-bold text-sm w-8">R{item.round}</span>
               <div className="font-mono text-sm">
                   <span className="text-gray-400">{formatTimeForInput(item.startTime)}</span>
                   <span className="text-cyan-400 mx-2">→</span>
                   <span className="text-gray-400">{formatTimeForInput(item.crashTime)}</span>
               </div>
           </div>
           <div className="flex items-center gap-4">
                <MultiplierDisplay multiplier={item.multiplier} />
                <Button onClick={() => onStartEdit(item.round)} size="sm" variant="secondary">{t('forecast.edit')}</Button>
           </div>
        </div>
    );
};