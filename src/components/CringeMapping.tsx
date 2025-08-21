import { ReactNode, useState } from 'react';
import { getCringeMapping, generateCringePreview } from '../services/roastGenerator';
import CringeSlider from './CringeSlider';
import type { Cringe, ZodiacSign } from '../types';

interface CringeMappingProps {
  selectedSign?: ZodiacSign;
}

const CringeMapping = ({ selectedSign = 'aries' }: CringeMappingProps): ReactNode => {
  const [selectedCringe, setSelectedCringe] = useState<Cringe>(1);
  const [showPreview, setShowPreview] = useState(false);

  const handleTogglePreview = (): void => {
    setShowPreview(!showPreview);
  };

  const mapping = getCringeMapping(selectedCringe);
  const preview = showPreview ? generateCringePreview(selectedCringe, selectedSign) : null;

  const getCringeColor = (level: Cringe): string => {
    switch (level) {
      case 0: return '#28a745';
      case 1: return '#ffc107';
      case 2: return '#fd7e14';
      case 3: return '#dc3545';
      default: return '#6c757d';
    }
  };

  const renderContentList = (title: string, items: string[], emoji: string): ReactNode => (
    <div style={{ marginBottom: '15px' }}>
      <h4 style={{ 
        margin: '0 0 8px 0', 
        color: getCringeColor(selectedCringe),
        fontSize: '14px',
        fontWeight: 'bold'
      }}>
        {emoji} {title} ({items.length} options)
      </h4>
      <div style={{ 
        display: 'flex', 
        flexWrap: 'wrap', 
        gap: '5px' 
      }}>
        {items.map((item, index) => (
          <span
            key={index}
            style={{
              padding: '4px 8px',
              backgroundColor: `${getCringeColor(selectedCringe)}20`,
              border: `1px solid ${getCringeColor(selectedCringe)}40`,
              borderRadius: '12px',
              fontSize: '11px',
              color: '#000000'
            }}
          >
            {item}
          </span>
        ))}
      </div>
    </div>
  );

  return (
    <div style={{ 
      padding: '20px', 
      maxWidth: '800px', 
      margin: '0 auto',
      backgroundColor: '#f8f9fa',
      borderRadius: '10px',
      border: '1px solid #dee2e6'
    }}>
      <h2 style={{ margin: '0 0 20px 0', textAlign: 'center', color: '#000000' }}>
        🎛️ Cringe Level Mapping Visualization
      </h2>

      <CringeSlider 
        value={selectedCringe}
        onChange={setSelectedCringe}
      />

      {/* Current Level Info */}
      <div style={{ 
        padding: '15px',
        backgroundColor: 'white',
        borderRadius: '8px',
        border: `2px solid ${getCringeColor(selectedCringe)}`,
        marginBottom: '20px'
      }}>
        <h3 style={{ 
          margin: '0 0 10px 0',
          color: getCringeColor(selectedCringe)
        }}>
          Level {selectedCringe}: {mapping.label}
        </h3>
        <p style={{ margin: '0 0 15px 0', fontStyle: 'italic', color: '#000000' }}>
          {mapping.description}
        </p>
        
        {/* Transform Features */}
        <div>
          <h4 style={{ 
            margin: '0 0 8px 0', 
            fontSize: '14px',
            color: '#000000'
          }}>
            🔧 Transform Features:
          </h4>
          <ul style={{ margin: 0, paddingLeft: '20px' }}>
            {mapping.transformFeatures.map((feature, index) => (
              <li key={index} style={{ 
                fontSize: '13px', 
                marginBottom: '4px',
                color: feature.includes('alternating caps') ? getCringeColor(selectedCringe) : 
                       feature.includes('elongation') ? '#e74c3c' :
                       feature.includes('emoji') ? '#f39c12' :
                       feature.includes('interjection') ? '#9b59b6' : '#666'
              }}>
                {feature}
              </li>
            ))}
          </ul>
        </div>

        {/* Transform Examples */}
        {selectedCringe > 0 && (
          <div style={{ marginTop: '15px' }}>
            <h4 style={{ 
              margin: '0 0 8px 0', 
              fontSize: '14px',
              color: getCringeColor(selectedCringe)
            }}>
              💡 Transform Examples:
            </h4>
            <div style={{ 
              fontSize: '12px', 
              color: '#000000',
              backgroundColor: '#f8f9fa',
              padding: '8px',
              borderRadius: '4px',
              border: '1px solid #dee2e6'
            }}>
              {selectedCringe === 1 && (
                <>
                  <div>😊 → 😊✨ (emoji upgrade)</div>
                  <div>"Trust your instincts (you know what I mean)"</div>
                </>
              )}
              {selectedCringe === 2 && (
                <>
                  <div>"amazing" → "aMaZiNg" (alternating caps)</div>
                  <div>"very good" → "INCREDIBLY good"</div>
                  <div>"OMG, your energy will shine! 😏👑"</div>
                </>
              )}
              {selectedCringe === 3 && (
                <>
                  <div>"good" → "goooood" (vowel elongation)</div>
                  <div>"aMaZiNg eNeRgY" (multiple alternating caps)</div>
                  <div>"FR FR, you're MIND-BLOWING! 🤡🎪💥⚡"</div>
                </>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Content Categories */}
      <div style={{ 
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '15px',
        marginBottom: '20px'
      }}>
        <div style={{ 
          padding: '15px',
          backgroundColor: 'white',
          borderRadius: '8px',
          border: '1px solid #dee2e6'
        }}>
          {renderContentList('Moods', mapping.availableOptions.moods, '😌')}
          {renderContentList('Work Situations', mapping.availableOptions.workSituations, '💼')}
        </div>

        <div style={{ 
          padding: '15px',
          backgroundColor: 'white',
          borderRadius: '8px',
          border: '1px solid #dee2e6'
        }}>
          {renderContentList('Love Situations', mapping.availableOptions.loveSituations, '💕')}
          {renderContentList('Tips', mapping.availableOptions.tips, '💡')}
        </div>
      </div>

      {/* Emojis and Punchlines */}
      <div style={{ 
        padding: '15px',
        backgroundColor: 'white',
        borderRadius: '8px',
        border: '1px solid #dee2e6',
        marginBottom: '20px'
      }}>
        {renderContentList('Emojis', mapping.availableOptions.emojis, '🎭')}
        
        {mapping.availableOptions.punchlines && (
          renderContentList('Punchlines', mapping.availableOptions.punchlines, '💥')
        )}
      </div>

      {/* Preview Button */}
      <div style={{ textAlign: 'center', marginBottom: '20px' }}>
        <button
          onClick={handleTogglePreview}
          style={{
            padding: '12px 24px',
            backgroundColor: getCringeColor(selectedCringe),
            color: 'white',
            border: 'none',
            borderRadius: '25px',
            fontSize: '14px',
            fontWeight: 'bold',
            cursor: 'pointer',
            transition: 'all 0.2s ease'
          }}
        >
          {showPreview ? 'Hide Preview' : 'Generate Sample Texts'}
        </button>
      </div>

      {/* Preview Samples */}
      {preview && (
        <div style={{ 
          padding: '15px',
          backgroundColor: '#fff',
          borderRadius: '8px',
          border: `2px solid ${getCringeColor(selectedCringe)}`,
          marginTop: '20px'
        }}>
          <h3 style={{ 
            margin: '0 0 15px 0',
            color: getCringeColor(selectedCringe)
          }}>
            📝 Sample Generated Texts (Level {selectedCringe})
          </h3>
          
          {preview.sampleTexts.map((text, index) => (
            <div
              key={index}
              style={{
                padding: '12px',
                backgroundColor: `${getCringeColor(selectedCringe)}10`,
                borderRadius: '6px',
                marginBottom: '10px',
                border: `1px solid ${getCringeColor(selectedCringe)}30`
              }}
            >
              <div style={{ 
                fontSize: '12px', 
                color: '#000000', 
                marginBottom: '5px',
                fontWeight: 'bold'
              }}>
                Sample #{index + 1}:
              </div>
              <div style={{ fontSize: '14px', lineHeight: '1.4', color: '#000000' }}>
                {text}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Statistics */}
      <div style={{ 
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '10px',
        marginTop: '20px'
      }}>
        {[
          { label: 'Total Moods', value: mapping.availableOptions.moods.length },
          { label: 'Work Options', value: mapping.availableOptions.workSituations.length },
          { label: 'Love Options', value: mapping.availableOptions.loveSituations.length },
          { label: 'Tips Available', value: mapping.availableOptions.tips.length },
          { label: 'Emojis', value: mapping.availableOptions.emojis.length },
          { label: 'Punchlines', value: mapping.availableOptions.punchlines?.length || 0 }
        ].map((stat, index) => (
          <div
            key={index}
            style={{
              padding: '10px',
              backgroundColor: `${getCringeColor(selectedCringe)}15`,
              borderRadius: '6px',
              textAlign: 'center',
              border: `1px solid ${getCringeColor(selectedCringe)}30`
            }}
          >
            <div style={{ 
              fontSize: '18px', 
              fontWeight: 'bold',
              color: getCringeColor(selectedCringe)
            }}>
              {stat.value}
            </div>
            <div style={{ fontSize: '12px', color: '#666' }}>
              {stat.label}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CringeMapping;
