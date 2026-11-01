import React, { useEffect } from 'react';
import { cn } from '../../lib/utils';

/** The shared editorial controller animates the visual duplicate; source text reserves layout. */
export function EncryptedText({ text, className }: { text: string; className?: string }) {
  useEffect(() => {
    window.dispatchEvent(new Event('terminal-content-change'));
  }, [text]);
  if (!text) return null;
  return (
    <span className={cn('ascii-text', className)} data-ascii-text>
      {text.split(/(\s+)/).map((word, index) =>
        /^\s+$/.test(word) ? (
          <React.Fragment key={index}>{word}</React.Fragment>
        ) : (
          <span className="ascii-word" key={index}>
            <span className="ascii-source">{word}</span>
            <span className="ascii-visual" aria-hidden="true" data-word={word}>{word}</span>
          </span>
        )
      )}
    </span>
  );
}
