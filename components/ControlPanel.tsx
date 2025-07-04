
import React, { useState, useCallback, ChangeEvent, useEffect } from 'react';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { Switch } from './ui/Switch';
import { useTranslations } from '../hooks/useTranslations';

interface ControlPanelProps {
    currentTime: Date;
    onGenerate: () => void;
    onReset: (newStartTime: Date) => void;
    onLoadHistory: (data: any[]) => void;
    onDownloadHistory: () => void;
    useRealTime: boolean;
    onUseRealTimeChange: (value: boolean) => void;
    isInTelegram: boolean;
}

export const ControlPanel = ({
    currentTime,
    onGenerate,
    onReset,
    onLoadHistory,
    onDownloadHistory,
    useRealTime,
    onUseRealTimeChange,
}: ControlPanelProps) => {
    const { t } = useTranslations();
    const [timeInput, setTimeInput] = useState(currentTime.toTimeString().split(' ')[0]);

    useEffect(() => {
        setTimeInput(currentTime.toTimeString().split(' ')[0]);
    }, [currentTime]);

    const handleReset = useCallback(() => {
        const [hours, minutes, seconds] = timeInput.split(':').map(Number);
        const newDate = new Date();
        newDate.setHours(hours, minutes, seconds || 0, 0);
        onReset(newDate);
    }, [timeInput, onReset]);

    const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const text = e.target?.result as string;
                // Basic CSV parsing
                const rows = text.split('\n').filter(row => row.trim() !== '');
                const headers = rows[0].split(',').map(h => h.trim().replace(/"/g, ''));
                const data = rows.slice(1).map(row => {
                    const values = row.split(',');
                    return headers.reduce((obj, header, index) => {
                        obj[header] = values[index]?.trim().replace(/"/g, '');
                        return obj;
                    }, {} as any);
                });
                onLoadHistory(data);
            };
            reader.readAsText(file);
        }
    };

    return (
        <Card>
            <Card.Title>{t('controls.title')}</Card.Title>
            <Card.Body>
                <div className="space-y-4">
                    <div>
                        <label htmlFor="start-time" className="block text-sm font-medium text-gray-400 mb-1">
                            {t('controls.sessionStart')}
                        </label>
                        <div className="flex space-x-2">
                            <input
                                id="start-time"
                                type="time"
                                step="1"
                                value={timeInput}
                                onChange={(e) => setTimeInput(e.target.value)}
                                className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
                            />
                            <Button onClick={handleReset} variant="secondary">{t('controls.set')}</Button>
                        </div>
                    </div>
                    
                    <div className="space-y-2 pt-2">
                        <Button onClick={onGenerate} className="w-full">
                            {t('controls.generate')}
                        </Button>
                        <div className="flex justify-center pt-1">
                            <Switch
                                id="use-real-time-toggle"
                                label={t('controls.useRealTime')}
                                checked={useRealTime}
                                onChange={onUseRealTimeChange}
                            />
                        </div>
                    </div>
                    
                    <div className="border-t border-gray-700 pt-4 space-y-2">
                         <h3 className="text-sm font-semibold text-gray-400">{t('controls.history')}</h3>
                         <Button onClick={onDownloadHistory} variant="secondary" className="w-full">
                            {t('controls.downloadCsv')}
                         </Button>
                         <div>
                            <label htmlFor="csv-upload" className="w-full text-center bg-gray-700 text-white font-bold py-2 px-4 rounded-lg transition duration-300 block hover:bg-gray-600 cursor-pointer">
                                {t('controls.loadCsv')}
                            </label>
                            <input
                                id="csv-upload"
                                type="file"
                                accept=".csv"
                                className="hidden"
                                onChange={handleFileChange}
                            />
                         </div>
                    </div>
                </div>
            </Card.Body>
        </Card>
    );
};