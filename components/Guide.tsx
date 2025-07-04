
import React from 'react';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { MULTIPLIER_COLORS } from '../constants';
import { useTranslations } from '../hooks/useTranslations';

interface GuideProps {
    onClose: () => void;
}

const GuideSection = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <div className="mb-4">
        <h3 className="text-lg font-bold text-cyan-400 mb-2">{title}</h3>
        <div className="space-y-2 text-sm text-gray-300 pl-2 border-l-2 border-gray-700">{children}</div>
    </div>
);

const QualityPhase = ({ color, title, children }: { color: string; title: string; children: React.ReactNode }) => (
    <div>
        <p className={`font-semibold ${color}`}>{title}</p>
        <p className="text-gray-400 text-xs">{children}</p>
    </div>
);


export const Guide = ({ onClose }: GuideProps) => {
    const { t } = useTranslations();
    
    return (
        <Card>
            <Card.Title>
                <div className="flex justify-between items-center">
                    <span>{t('guide.title')}</span>
                    <Button onClick={onClose} size="sm" variant="secondary">{t('guide.close')}</Button>
                </div>
            </Card.Title>
            <Card.Body className="max-h-[60vh] overflow-y-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <GuideSection title={t('guide.qualityPhases.title')}>
                            <QualityPhase color="text-green-400" title={t('guide.qualityPhases.good.title')}>{t('guide.qualityPhases.good.desc')}</QualityPhase>
                            <QualityPhase color="text-purple-400" title={t('guide.qualityPhases.normal.title')}>{t('guide.qualityPhases.normal.desc')}</QualityPhase>
                            <QualityPhase color="text-orange-400" title={t('guide.qualityPhases.bad.title')}>{t('guide.qualityPhases.bad.desc')}</QualityPhase>
                            <QualityPhase color="text-red-400" title={t('guide.qualityPhases.catastrophic.title')}>{t('guide.qualityPhases.catastrophic.desc')}</QualityPhase>
                        </GuideSection>
                        <GuideSection title={t('guide.multiplierTiers.title')}>
                            {Object.entries(MULTIPLIER_COLORS).map(([key, {text, ball}]) => (
                                <p key={key} className={text}>{ball} {t(`guide.multiplierTiers.${key}`)}</p>
                            ))}
                        </GuideSection>
                    </div>
                    <div>
                        <GuideSection title={t('guide.temporalCycles.title')}>
                            <p><strong className="text-gray-200">{t('guide.temporalCycles.hourly.title')}</strong> {t('guide.temporalCycles.hourly.desc')}</p>
                            <p><strong className="text-gray-200">{t('guide.temporalCycles.quarterly.title')}</strong> {t('guide.temporalCycles.quarterly.desc')}</p>
                            <p><strong className="text-gray-200">{t('guide.temporalCycles.fiveMin.title')}</strong> {t('guide.temporalCycles.fiveMin.desc')}</p>
                        </GuideSection>
                        <GuideSection title={t('guide.specialMinutes.title')}>
                            <p><strong className="text-red-400">{t('guide.specialMinutes.nineOne.title')}</strong> {t('guide.specialMinutes.nineOne.desc')}</p>
                            <p><strong className="text-red-400">{t('guide.specialMinutes.seven.title')}</strong> {t('guide.specialMinutes.seven.desc')}</p>
                            <p><strong className="text-orange-400">{t('guide.specialMinutes.fiveThree.title')}</strong> {t('guide.specialMinutes.fiveThree.desc')}</p>
                        </GuideSection>
                    </div>
                </div>
            </Card.Body>
        </Card>
    );
};
