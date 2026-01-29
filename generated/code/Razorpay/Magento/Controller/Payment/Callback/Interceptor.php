<?php
namespace Razorpay\Magento\Controller\Payment\Callback;

/**
 * Interceptor class for @see \Razorpay\Magento\Controller\Payment\Callback
 */
class Interceptor extends \Razorpay\Magento\Controller\Payment\Callback implements \Magento\Framework\Interception\InterceptorInterface
{
    use \Magento\Framework\Interception\Interceptor;

    public function __construct(\Magento\Framework\App\Action\Context $context, \Magento\Customer\Model\Session $customerSession, \Magento\Checkout\Model\Session $checkoutSession, \Razorpay\Magento\Model\Config $config, \Psr\Log\LoggerInterface $logger, \Magento\Sales\Api\OrderRepositoryInterface $orderRepository, \Magento\Framework\DB\Transaction $transaction, \Magento\Sales\Model\Service\InvoiceService $invoiceService, \Magento\Sales\Model\Order\Email\Sender\OrderSender $orderSender, \Magento\Sales\Model\Order\Email\Sender\InvoiceSender $invoiceSender, \Magento\Catalog\Model\Session $catalogSession, \Magento\Sales\Api\Data\OrderInterface $order, \Razorpay\Magento\Model\TrackPluginInstrumentation $trackPluginInstrumentation)
    {
        $this->___init();
        parent::__construct($context, $customerSession, $checkoutSession, $config, $logger, $orderRepository, $transaction, $invoiceService, $orderSender, $invoiceSender, $catalogSession, $order, $trackPluginInstrumentation);
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
