<?php
/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */
namespace Magento\Framework\View\Element\Html;

use Magento\Framework\Locale\Bundle\DataBundle;

/**
 * Calendar block for page header
 */
class Calendar extends \Magento\Framework\View\Element\Template
{
    protected $_date;
    protected $encoder;
    protected $_localeResolver;

    public function __construct(
        \Magento\Framework\View\Element\Template\Context $context,
        \Magento\Framework\Stdlib\DateTime\DateTime $date,
        \Magento\Framework\Json\EncoderInterface $encoder,
        \Magento\Framework\Locale\ResolverInterface $localeResolver,
        array $data = []
    ) {
        $this->_date = $date;
        $this->encoder = $encoder;
        $this->_localeResolver = $localeResolver;
        parent::__construct($context, $data);
    }

    protected function _toHtml()
    {
        $localeData = (new DataBundle())->get($this->_localeResolver->getLocale());

        // PHP 8.3: Always use get() for ResourceBundle
        $calendar = $localeData->get('calendar');
        $gregorian = $calendar ? $calendar->get('gregorian') : null;

        // Days names
        $daysData = $gregorian ? $gregorian->get('dayNames') : null;
        $daysFormat = $daysData ? $daysData->get('format') : null;
        
        $this->assign('days', [
            'wide' => $this->encoder->encode(($daysFormat && $daysFormat->get('wide')) ? array_values(iterator_to_array($daysFormat->get('wide'))) : []),
            'abbreviated' => $this->encoder->encode(($daysFormat && $daysFormat->get('abbreviated')) ? array_values(iterator_to_array($daysFormat->get('abbreviated'))) : []),
        ]);

        // Months names
        $monthsData = $gregorian ? $gregorian->get('monthNames') : null;
        $monthsFormat = $monthsData ? $monthsData->get('format') : null;
        
        $this->assign('months', [
            'wide' => $this->encoder->encode(($monthsFormat && $monthsFormat->get('wide')) ? array_values(iterator_to_array($monthsFormat->get('wide'))) : []),
            'abbreviated' => $this->encoder->encode(array_values(iterator_to_array(
                ($monthsFormat && $monthsFormat->get('abbreviated')) ? $monthsFormat->get('abbreviated') : ($monthsFormat && $monthsFormat->get('wide') ? $monthsFormat->get('wide') : [])
            ))),
        ]);

        $this->assignFieldsValues($localeData);

        // AM/PM Markers
        $amPmMarkers = $gregorian ? $gregorian->get('AmPmMarkers') : null;
        $this->assign('am', $this->encoder->encode($amPmMarkers ? $amPmMarkers->get(0) : 'AM'));
        $this->assign('pm', $this->encoder->encode($amPmMarkers ? $amPmMarkers->get(1) : 'PM'));

        // Logic for firstDay and weekend
        $this->assign('firstDay', (int)$this->_scopeConfig->getValue('general/locale/firstday', \Magento\Store\Model\ScopeInterface::SCOPE_STORE));
        $this->assign('weekendDays', $this->encoder->encode((string)$this->_scopeConfig->getValue('general/locale/weekend', \Magento\Store\Model\ScopeInterface::SCOPE_STORE)));

        // Formats
        $this->assign('defaultFormat', $this->encoder->encode($this->_localeDate->getDateFormat(\IntlDateFormatter::MEDIUM)));
        $this->assign('toolTipFormat', $this->encoder->encode($this->_localeDate->getDateFormat(\IntlDateFormatter::LONG)));

        // en_US Fallback
        $enData = (new DataBundle())->get('en_US');
        $enGregorian = $enData->get('calendar') ? $enData->get('calendar')->get('gregorian') : null;
        $enMonths = $enGregorian ? $enGregorian->get('monthNames') : null;
        $enMonthsFmt = $enMonths ? $enMonths->get('format') : null;

        $enUS = new \stdClass();
        $enUS->m = new \stdClass();
        $enUS->m->wide = ($enMonthsFmt && $enMonthsFmt->get('wide')) ? array_values(iterator_to_array($enMonthsFmt->get('wide'))) : [];
        $enUS->m->abbr = ($enMonthsFmt && $enMonthsFmt->get('abbreviated')) ? array_values(iterator_to_array($enMonthsFmt->get('abbreviated'))) : [];
        $this->assign('enUS', $this->encoder->encode($enUS));

        return parent::_toHtml();
    }

    private function assignFieldsValues(\ResourceBundle $localeData): void
    {
        $fields = $localeData->get('fields');
        $day = $fields ? $fields->get('day') : null;
        $relative = $day ? $day->get('relative') : null;
        $week = $fields ? $fields->get('week') : null;

        if ($relative && $week && $week->get('dn')) {
            $this->assign('today', $this->encoder->encode($relative->get(0)));
            $this->assign('week', $this->encoder->encode($week->get('dn')));
        } else {
            $this->assign('today', $this->encoder->encode('Today'));
            $this->assign('week', $this->encoder->encode('Week'));
        }
    }

    public function getTimezoneOffsetSeconds() { return $this->_date->getGmtOffset(); }
    public function getStoreTimestamp($store = null) { return $this->_localeDate->scopeTimeStamp($store); }
    public function getYearRange() { 
        return (new \DateTime())->modify('- 100 years')->format('Y') . ':' . (new \DateTime())->modify('+ 100 years')->format('Y'); 
    }
}