<?php
namespace Razorpay\Magento\Controller\Payment\Validate;

/**
 * Interceptor class for @see \Razorpay\Magento\Controller\Payment\Validate
 */
class Interceptor extends \Razorpay\Magento\Controller\Payment\Validate implements \Magento\Framework\Interception\InterceptorInterface
{
    use \Magento\Framework\Interception\Interceptor;

    public function __construct(\Magento\Framework\App\Action\Context $context, \Magento\Customer\Model\Session $customerSession, \Magento\Checkout\Model\Session $checkoutSession, \Razorpay\Magento\Model\Config $config, \Magento\Catalog\Model\Session $catalogSession, \Magento\Sales\Api\Data\OrderInterface $order, \Magento\Sales\Model\Service\InvoiceService $invoiceService, \Magento\Framework\DB\Transaction $transaction, \Magento\Sales\Model\Order\Email\Sender\InvoiceSender $invoiceSender, \Magento\Sales\Api\OrderRepositoryInterface $orderRepository, \Magento\Sales\Model\Order\Email\Sender\OrderSender $orderSender, \Psr\Log\LoggerInterface $logger, \Razorpay\Magento\Model\TrackPluginInstrumentation $trackPluginInstrumentation)
    {
        $this->___init();
        parent::__construct($context, $customerSession, $checkoutSession, $config, $catalogSession, $order, $invoiceService, $transaction, $invoiceSender, $orderRepository, $orderSender, $logger, $trackPluginInstrumentation);
    }

    /**
     * {@inheritdoc}
     */
    public function execute()
    {
        $pluginInfo = $this->pluginList->getNext($this->subjectType, 'execute');
        return $pluginInfo ? $this->___callPlugins('execute', func_get_args(), $pluginInfo) : parent::execute();
    }

    /**
     * {@inheritdoc}
     */
    public function dispatch(\Magento\Framework\App\RequestInterface $request)
    {
        $pluginInfo = $this->pluginList->getNext($this->subjectType, 'dispatch');
        return $pluginInfo ? $this->___callPlugins('dispatch', func_get_args(), $pluginInfo) : parent::dispatch($request);
    }
}
