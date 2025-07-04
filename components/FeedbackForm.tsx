
import React, { useState } from 'react';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { useTranslations } from '../hooks/useTranslations';

interface FeedbackFormProps {
    startTime: Date;
    onApplyFeedback: (multiplier: number, crashTime: Date) => void;
}

export const FeedbackForm = ({ startTime, onApplyFeedback }: FeedbackFormProps) => {
    const { t } = useTranslations();
    const [multiplier, setMultiplier] = useState('');
    const [crashTime, setCrashTime] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const m = parseFloat(multiplier);
        if (isNaN(m) || m < 1) {
            setError(t('feedback.error.multiplier'));
            return;
        }

        if (!crashTime) {
            setError(t('feedback.error.crashTime'));
            return;
        }

        const [hours, minutes, seconds] = crashTime.split(':').map(Number);
        const ct = new Date(startTime);
        ct.setHours(hours, minutes, seconds || 0);

        if (ct <= startTime) {
             setError(t('feedback.error.crashTimeInvalid', { startTime: startTime.toLocaleTimeString() }));
             return;
        }
        
        setError('');
        onApplyFeedback(m, ct);
        setMultiplier('');
        setCrashTime('');
    };

    return (
        <Card>
            <Card.Title>{t('feedback.title')}</Card.Title>
            <Card.Body>
                <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
                    <div>
                        <label htmlFor="real-multiplier" className="block text-sm font-medium text-gray-400 mb-1">
                            {t('feedback.multiplierLabel')}
                        </label>
                        <Input
                            id="real-multiplier"
                            type="number"
                            step="0.01"
                            min="1.00"
                            placeholder={t('feedback.multiplierPlaceholder')}
                            value={multiplier}
                            onChange={(e) => setMultiplier(e.target.value)}
                        />
                    </div>
                    <div>
                        <label htmlFor="crash-time" className="block text-sm font-medium text-gray-400 mb-1">
                            {t('feedback.crashTimeLabel')}
                        </label>
                        <Input
                            id="crash-time"
                            type="time"
                            step="1"
                            value={crashTime}
                            onChange={(e) => setCrashTime(e.target.value)}
                        />
                    </div>
                    <Button type="submit" className="w-full">{t('feedback.submitButton')}</Button>
                </form>
                {error && <p className="text-red-400 text-sm mt-2">{error}</p>}
            </Card.Body>
        </Card>
    );
};
