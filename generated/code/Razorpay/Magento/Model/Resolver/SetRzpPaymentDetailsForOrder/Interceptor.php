<?php
namespace Razorpay\Magento\Model\Resolver\SetRzpPaymentDetailsForOrder;

/**
 * Interceptor class for @see \Razorpay\Magento\Model\Resolver\SetRzpPaymentDetailsForOrder
 */
class Interceptor extends \Razorpay\Magento\Model\Resolver\SetRzpPaymentDetailsForOrder implements \Magento\Framework\Interception\InterceptorInterface
{
    use \Magento\Framework\Interception\Interceptor;

    public function __construct(\Razorpay\Magento\Model\PaymentMethod $paymentMethod, \Magento\Sales\Api\Data\OrderInterface $order, \Razorpay\Magento\Model\Config $config, \Magento\Sales\Model\Service\InvoiceService $invoiceService, \Magento\Framework\DB\Transaction $transaction, \Magento\Framework\App\Config\ScopeConfigInterface $scopeConfig, \Magento\Checkout\Model\Session $checkoutSession, \Magento\Sales\Model\Order\Email\Sender\InvoiceSender $invoiceSender, \Magento\Sales\Model\Order\Email\Sender\OrderSender $orderSender, \Psr\Log\LoggerInterface $logger, \Razorpay\Magento\Model\TrackPluginInstrumentation $trackPluginInstrumentation)
    {
        $this->___init();
        parent::__construct($paymentMethod, $order, $config, $invoiceService, $transaction, $scopeConfig, $checkoutSession, $invoiceSender, $orderSender, $logger, $trackPluginInstrumentation);
    }

    /**
     * {@inheritdoc}
     */
    public function resolve(\Magento\Framework\GraphQl\Config\Element\Field $field, $context, \Magento\Framework\GraphQl\Schema\Type\ResolveInfo $info, ?array $value = null, ?array $args = null)
    {
        $pluginInfo = $this->pluginList->getNext($this->subjectType, 'resolve');
        return $pluginInfo ? $this->___callPlugins('resolve', func_get_args(), $pluginInfo) : parent::resolve($field, $context, $info, $value, $args);
    }
}
